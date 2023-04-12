namespace Shared


type ServerMsg =
    | ConnectBase

type ClientMsg =
    | ConnectBase

module Shared =

    let endpoint = "/socket"

    type Student = {
        Name : string
        Age : int}

    type IStudentApi = {
        studentByName : string -> Async<Student option>
        allStudents : unit -> Async<list<Student>>
        newStudent : Student -> Async<list<Student>> }