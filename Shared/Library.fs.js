import { Record, Union } from "../Client/fable_modules/fable-library.4.0.4/Types.js";
import { list_type, unit_type, lambda_type, class_type, option_type, record_type, int32_type, string_type, union_type } from "../Client/fable_modules/fable-library.4.0.4/Reflection.js";

export class ServerMsg extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["ConnectBase"];
    }
}

export function ServerMsg$reflection() {
    return union_type("Shared.ServerMsg", [], ServerMsg, () => [[]]);
}

export class ClientMsg extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["ConnectBase"];
    }
}

export function ClientMsg$reflection() {
    return union_type("Shared.ClientMsg", [], ClientMsg, () => [[]]);
}

export const Shared_endpoint = "/socket";

export class Shared_Student extends Record {
    constructor(Name, Age) {
        super();
        this.Name = Name;
        this.Age = (Age | 0);
    }
}

export function Shared_Student$reflection() {
    return record_type("Shared.Shared.Student", [], Shared_Student, () => [["Name", string_type], ["Age", int32_type]]);
}

export class Shared_IStudentApi extends Record {
    constructor(studentByName, allStudents, newStudent) {
        super();
        this.studentByName = studentByName;
        this.allStudents = allStudents;
        this.newStudent = newStudent;
    }
}

export function Shared_IStudentApi$reflection() {
    return record_type("Shared.Shared.IStudentApi", [], Shared_IStudentApi, () => [["studentByName", lambda_type(string_type, class_type("Microsoft.FSharp.Control.FSharpAsync`1", [option_type(Shared_Student$reflection())]))], ["allStudents", lambda_type(unit_type, class_type("Microsoft.FSharp.Control.FSharpAsync`1", [list_type(Shared_Student$reflection())]))], ["newStudent", lambda_type(Shared_Student$reflection(), class_type("Microsoft.FSharp.Control.FSharpAsync`1", [list_type(Shared_Student$reflection())]))]]);
}

