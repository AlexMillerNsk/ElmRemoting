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
            bindings = [HttpBinding.createSimple HTTP "127.0.0.1" port]
            homeFolder = Some(Path.GetFullPath "./Public") }
    startWebServer config app
    0