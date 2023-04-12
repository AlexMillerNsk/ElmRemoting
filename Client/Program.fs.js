import { toString, FSharpRef, Union, Record } from "./fable_modules/fable-library.4.0.4/Types.js";
import { class_type, union_type, record_type, list_type, string_type } from "./fable_modules/fable-library.4.0.4/Reflection.js";
import { singleton } from "./fable_modules/fable-library.4.0.4/AsyncBuilder.js";
import { startImmediate } from "./fable_modules/fable-library.4.0.4/Async.js";
import { Cmd_none, Cmd_ofEffect } from "./fable_modules/Fable.Elmish.4.0.0/cmd.fs.js";
import { Helpers_rpcmappings, Helpers_mappings, Helpers_getBaseUrl, Bridge_Sender_299A679D } from "./fable_modules/Elmish.Bridge.Client.7.0.2/./Library.fs.js";
import { Shared_endpoint, Shared_Student, Shared_IStudentApi$reflection, ClientMsg$reflection, ClientMsg } from "../Shared/Library.fs.js";
import { Remoting_buildProxy_64DC51C } from "./fable_modules/Fable.Remoting.Client.7.25.0/./Remoting.fs.js";
import { RemotingModule_createApi } from "./fable_modules/Fable.Remoting.Client.7.25.0/Remoting.fs.js";
import { cons, reverse, ofArray, singleton as singleton_1, map as map_1, empty } from "./fable_modules/fable-library.4.0.4/List.js";
import { createElement } from "react";
import { trimEnd, replace, join } from "./fable_modules/fable-library.4.0.4/String.js";
import { Interop_reactApi } from "./fable_modules/Feliz.2.6.0/./Interop.fs.js";
import { compare, comparePrimitives, equals, createObj } from "./fable_modules/fable-library.4.0.4/Util.js";
import { iterate, map as map_2, delay, toList } from "./fable_modules/fable-library.4.0.4/Seq.js";
import { ProgramModule_mkProgram, ProgramModule_run } from "./fable_modules/Fable.Elmish.4.0.0/program.fs.js";
import { ProgramModule_mapSubscription } from "./fable_modules/Elmish.Bridge.Client.7.0.2/../Fable.Elmish.4.0.0/program.fs.js";
import { add, remove, tryFind, empty as empty_1 } from "./fable_modules/fable-library.4.0.4/Map.js";
import { BridgeConfig$2, UrlMode } from "./fable_modules/Elmish.Bridge.Client.7.0.2/Library.fs.js";
import { map as map_3, toArray, bind, defaultArg } from "./fable_modules/fable-library.4.0.4/Option.js";
import { parse } from "./fable_modules/fable-library.4.0.4/Guid.js";
import { createTypeInfo } from "./fable_modules/Fable.SimpleJson.3.24.0/./TypeInfo.Converter.fs.js";
import { Convert_fromJson, Convert_serialize } from "./fable_modules/Fable.SimpleJson.3.24.0/./Json.Converter.fs.js";
import { FSharpResult$2 } from "./fable_modules/fable-library.4.0.4/Choice.js";
import { SimpleJson_parseNative } from "./fable_modules/Fable.SimpleJson.3.24.0/./SimpleJson.fs.js";
import { Program_withReactSynchronous } from "./fable_modules/Fable.Elmish.React.4.0.0/react.fs.js";

export class Model extends Record {
    constructor(TextBox, Content) {
        super();
        this.TextBox = TextBox;
        this.Content = Content;
    }
}

export function Model$reflection() {
    return record_type("Client.Model", [], Model, () => [["TextBox", string_type], ["Content", list_type(string_type)]]);
}

export class Msg extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["SentMsg", "SetTextBox", "SetChat", "Test"];
    }
}

export function Msg$reflection() {
    return union_type("Client.Msg", [], Msg, () => [[], [["Item", string_type]], [["Item", list_type(string_type)]], []]);
}

export function Cmd_fromAsync(operation) {
    const delayedCmd = (dispatch) => {
        const delayedDispatch = singleton.Delay(() => singleton.Bind(operation, (_arg) => {
            const msg = _arg;
            dispatch(msg);
            return singleton.Zero();
        }));
        startImmediate(delayedDispatch);
    };
    return Cmd_ofEffect(delayedCmd);
}

export function sender() {
    Bridge_Sender_299A679D(new ClientMsg(0, []), void 0, () => {
    }, ClientMsg$reflection());
}

export const studentApi = Remoting_buildProxy_64DC51C(RemotingModule_createApi(), Shared_IStudentApi$reflection());

export function init() {
    return [new Model("", empty()), Cmd_none()];
}

export function sendText(model) {
    return singleton.Delay(() => singleton.Bind(studentApi.newStudent(new Shared_Student(model.TextBox, 22)), (_arg) => {
        const result = _arg;
        const itog = map_1((x) => x.Name, result);
        return singleton.Return(new Msg(2, [itog]));
    }));
}

export function sendTest(model) {
    return singleton.Delay(() => {
        sender();
        const hui = singleton_1("sended");
        return singleton.Return(new Msg(2, [hui]));
    });
}

export function update(msg, model) {
    switch (msg.tag) {
        case 1: {
            const v = msg.fields[0];
            return [new Model(v, model.Content), Cmd_none()];
        }
        case 2: {
            const x = msg.fields[0];
            return [new Model("", x), Cmd_none()];
        }
        case 3:
            return [model, Cmd_fromAsync(sendTest(model))];
        default:
            return [model, Cmd_fromAsync(sendText(model))];
    }
}

export const appTitle = createElement("p", {
    className: "title",
    children: "Welcome to our Awesome Chat!",
});

export function div(classes, children) {
    return createElement("div", {
        className: join(" ", classes),
        children: Interop_reactApi.Children.toArray(Array.from(children)),
    });
}

export function newButton(model, dispatch) {
    return div(singleton_1("box"), singleton_1(createElement("button", {
        className: join(" ", ["button", "is-primary", "is-medium"]),
        onClick: (_arg) => {
            dispatch(new Msg(3, []));
        },
    })));
}

export function renderLists(model, dispatch) {
    let elems;
    return div(singleton_1("box"), singleton_1(div(ofArray(["columns", "is-mobile", "is-vcentered"]), singleton_1(div(singleton_1("column"), singleton_1(createElement("ul", createObj(singleton_1((elems = toList(delay(() => {
        const reversed = reverse(model.Content);
        return map_2((chat) => createElement("li", {
            className: join(" ", ["box", "subtitle"]),
            children: chat,
        }), reversed);
    })), ["children", Interop_reactApi.Children.toArray(Array.from(elems))]))))))))));
}

export function inputField(model, dispatch) {
    let value_1, elems;
    return div(ofArray(["field", "has-addons"]), ofArray([div(ofArray(["control", "is-expanded"]), singleton_1(createElement("input", createObj(ofArray([["className", join(" ", ["input", "is-medium"])], (value_1 = model.TextBox, ["ref", (e) => {
        if (!(e == null) && !equals(e.value, value_1)) {
            e.value = value_1;
        }
    }]), ["onChange", (ev) => {
        dispatch(new Msg(1, [ev.target.value]));
    }]]))))), div(singleton_1("control"), singleton_1(createElement("button", createObj(ofArray([["className", join(" ", ["button", "is-primary", "is-medium"])], ["onClick", (_arg) => {
        dispatch(new Msg(0, []));
    }], (elems = [createElement("i", {
        className: join(" ", ["fa", "fa-plus"]),
    })], ["children", Interop_reactApi.Children.toArray(Array.from(elems))])])))))]));
}

export function view(model, dispatch) {
    let elems;
    return createElement("div", createObj(ofArray([["style", {
        padding: 20,
    }], (elems = [appTitle, inputField(model, dispatch), renderLists(model, dispatch), newButton(model, dispatch)], ["children", Interop_reactApi.Children.toArray(Array.from(elems))])])));
}

ProgramModule_run(ProgramModule_mapSubscription((prev, m) => cons([ofArray(["Elmish", "Bridge"]), (dispatch_1) => {
    const config = new BridgeConfig$2(Shared_endpoint, void 0, (x) => x, empty_1({
        Compare: comparePrimitives,
    }), 1, void 0, new UrlMode(1, []));
    const this$ = config;
    const dispatch_2 = dispatch_1;
    let url_4;
    const matchValue = this$.urlMode;
    switch (matchValue.tag) {
        case 0: {
            const url_1 = Helpers_getBaseUrl();
            url_1.pathname = (url_1.pathname + this$.path);
            url_4 = url_1;
            break;
        }
        case 3: {
            const f = matchValue.fields[0];
            const url_2 = Helpers_getBaseUrl();
            const arg = f(url_2.href, this$.path);
            url_4 = (new URL(arg));
            break;
        }
        case 2: {
            const url_3 = new URL(this$.path);
            url_3.protocol = replace(url_3.protocol, "http", "ws");
            url_4 = url_3;
            break;
        }
        default: {
            const url = Helpers_getBaseUrl();
            url.pathname = this$.path;
            url_4 = url;
        }
    }
    const wsref = defaultArg(bind((tupledArg) => {
        const socket = tupledArg[1];
        const matchValue_1 = socket.contents;
        let matchResult_2;
        if (matchValue_1[0] == null) {
            if (matchValue_1[1]) {
                matchResult_2 = 0;
            }
            else {
                matchResult_2 = 1;
            }
        }
        else {
            matchResult_2 = 1;
        }
        switch (matchResult_2) {
            case 0:
                return void 0;
            case 1:
                return socket;
        }
    }, tryFind(this$.name, defaultArg(Helpers_mappings.contents, empty_1({
        Compare: compare,
    })))), new FSharpRef([void 0, false]));
    const websocket = (timeout, server) => {
        const matchValue_2 = wsref.contents;
        let matchResult_3;
        if (matchValue_2[0] == null) {
            if (matchValue_2[1]) {
                matchResult_3 = 0;
            }
            else {
                matchResult_3 = 1;
            }
        }
        else {
            matchResult_3 = 0;
        }
        switch (matchResult_3) {
            case 0: {
                break;
            }
            case 1: {
                const socket_1 = new WebSocket(server);
                wsref.contents = [socket_1, false];
                socket_1.onclose = ((_arg_2) => {
                    const closed = wsref.contents[1];
                    wsref.contents = [void 0, closed];
                    iterate(dispatch_2, toArray(this$.whenDown));
                    if (!closed) {
                        window.setTimeout(() => {
                            websocket(timeout, server);
                        }, timeout, void 0);
                    }
                });
                socket_1.onmessage = ((e) => {
                    let inputJson, typeInfo_1;
                    const message = toString(e.data);
                    if (message.indexOf("R") === 0) {
                        const guid = parse(message.slice(1, 36 + 1));
                        const json = message.slice(37, message.length);
                        iterate((tupledArg_1) => {
                            const f_1 = tupledArg_1[0];
                            const og = tupledArg_1[1];
                            f_1(json);
                            Helpers_rpcmappings.contents = map_3((m_1) => remove(og, remove(guid, m_1)), Helpers_rpcmappings.contents);
                        }, toArray(tryFind(guid, defaultArg(Helpers_rpcmappings.contents, empty_1({
                            Compare: comparePrimitives,
                        })))));
                    }
                    else if (message.indexOf("E") === 0) {
                        const guid_1 = parse(message.slice(1, message.length));
                        iterate((tupledArg_2) => {
                            let value_5, typeInfo;
                            const f_2 = tupledArg_2[0];
                            const og_1 = tupledArg_2[1];
                            f_2((value_5 = (new Error("Server couldn\'t process your message")), (typeInfo = createTypeInfo(class_type("System.Exception")), Convert_serialize(value_5, typeInfo))));
                            Helpers_rpcmappings.contents = map_3((m_1_1) => remove(og_1, remove(guid_1, m_1_1)), Helpers_rpcmappings.contents);
                        }, toArray(tryFind(guid_1, defaultArg(Helpers_rpcmappings.contents, empty_1({
                            Compare: comparePrimitives,
                        })))));
                    }
                    else {
                        let _arg_3;
                        const input = toString(e.data);
                        try {
                            _arg_3 = (new FSharpResult$2(0, [(inputJson = SimpleJson_parseNative(input), (typeInfo_1 = createTypeInfo(Msg$reflection()), Convert_fromJson(inputJson, typeInfo_1)))]));
                        }
                        catch (ex) {
                            _arg_3 = (new FSharpResult$2(1, [ex.message]));
                        }
                        if (_arg_3.tag === 0) {
                            const msg_1 = _arg_3.fields[0];
                            dispatch_2(this$.mapping(msg_1));
                        }
                    }
                });
                break;
            }
        }
    };
    websocket(this$.retryTime * 1000, trimEnd(url_4.href, "#"));
    Helpers_mappings.contents = add(this$.name, [this$.customSerializers, wsref, (e_1) => ((callback) => {
        const matchValue_3 = wsref.contents;
        if (matchValue_3[0] == null) {
            callback();
        }
        else {
            const socket_2 = matchValue_3[0];
            socket_2.send(e_1);
        }
    })], defaultArg(Helpers_mappings.contents, empty_1({
        Compare: compare,
    })));
    return config;
}], prev(m)), Program_withReactSynchronous("elmish-app", ProgramModule_mkProgram(init, update, view))));

