module Server

open System
open System.IO
open Suave
open Fable.Remoting.Server
open Fable.Remoting.Suave
open Elmish
open Elmish.Bridge
open Shared
open Shared 
open Filters
open Operators

let init (clientDispatch:Dispatch<ClientMsg>) () =
  clientDispatch ConnectBase, Cmd.none

let update clientDispatch msg state =
 match msg with
 | ConnectBase -> printfn "get msg", Cmd.none

let getStudents() =
  async {
    return [
        { Name = "Mike";  Age = 23; }
        { Name = "John";  Age = 22; }
        { Name = "Diana"; Age = 22; } ] }

let findStudentByName name =
  async {
    let! students = getStudents()
    let student = List.tryFind (fun student -> student.Name = name) students
    return student }

let newStudent student = 
  async {
    let! students = getStudents()
    printfn $"Name is - {student.Name}"
    return student::students }

let studentApi : IStudentApi = {
    studentByName = findStudentByName
    allStudents = getStudents
    newStudent = newStudent } 

let encode input = 
    if input = "" then "" else
        let format (c, n) = (if n = 1 then "" else string n) + c.ToString()
        let counter (result, (counted, count)) c = 
            if c = counted 
            then (result, (counted, count + 1)) 
            else (result + format (counted, count), (c, 1))
        let state = Seq.fold counter ("", (input.[0], 1)) input.[1..]
        fst state + format (snd state)
let decode input = 
    let format (c:char) n = 
        if n = 0 then string c 
        else [0..n - 1] |> Seq.map (fun _ -> c) |> String.Concat
    let counter (result, count) c =
        if Char.IsNumber c 
        then (result, count * 10 + (string c |> int))
        else (result + format c count, 0)
    Seq.fold counter ("", 0) input |> fst



[<EntryPoint>]
let main argv =
    let server =
      Bridge.mkServer Shared.endpoint init update
      |> Bridge.run Suave.server
    let fableWebApi : WebPart = 
        Remoting.createApi()
        |> Remoting.fromValue studentApi
        |> Remoting.buildWebPart 
    let app: WebPart =
         choose [
              server
              fableWebApi
              GET >=> path "/" >=> Files.browseFileHome "index.html"    
              GET >=> path "/test" >=> Successful.OK "Biden666"
              GET >=> Files.browseHome
              RequestErrors.NOT_FOUND "Page not found." 
              POST >=> path "/hello" >=> Successful.OK "Hello POST"]
 

    let portEnvVar = Environment.GetEnvironmentVariable "PORT"
    let port = if String.IsNullOrEmpty portEnvVar then 8080 else (int)portEnvVar
    let config = {
        defaultConfig with
            bindings = [HttpBinding.createSimple HTTP "0.0.0.0" port]
            homeFolder = Some(Path.GetFullPath "./Public") }
    startWebServer config app
    0



