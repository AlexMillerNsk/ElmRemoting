module Client 

open Elmish
open Elmish.React
open Elmish.Bridge
open Fable.Remoting.Client
open Feliz
open Shared
open Shared



type Model = { TextBox: string 
               Content: string list}

type Msg =
    | SentMsg
    | SetTextBox of string
    | SetChat of string list
    | Test
module Cmd = 
    let fromAsync (operation: Async<Msg>) : Cmd<Msg> =
        let delayedCmd (dispatch: Msg -> unit) : unit =
            let delayedDispatch = async {
                let! msg = operation
                dispatch msg }
            Async.StartImmediate delayedDispatch
        Cmd.ofEffect delayedCmd

let sender() =  Bridge.Send ClientMsg.ConnectBase


let studentApi =
    Remoting.createApi()
    |> Remoting.buildProxy<IStudentApi>


let init() = { TextBox = ""
               Content = []}, Cmd.none  

let sendText model = async {
    let! result = studentApi.newStudent { Name = model.TextBox; Age = 22 }
    let itog = result |> List.map (fun x -> x.Name)
    return SetChat itog   }

let sendTest model = async {
    sender()
    let hui =["sended"]
    return SetChat hui
  }
    
let update msg model =
    match msg with
    | SentMsg             ->   model, Cmd.fromAsync (sendText model)
    | SetTextBox v        -> { model with TextBox = v }, Cmd.none
    | SetChat x           -> { model with Content = x; TextBox = ""}, Cmd.none
    | Test                ->   model, Cmd.fromAsync (sendTest model )

let appTitle =
  Html.p [
    prop.className "title"
    prop.text "Welcome to our Awesome Chat!"
  ]

let div (classes: string list) (children: ReactElement list) =
    Html.div [
        prop.classes classes
        prop.children children
    ]
let newButton (model: Model) (dispatch: Msg -> unit) =
  div [ "box" ] [
          Html.button [
            prop.classes [ "button"; "is-primary"; "is-medium" ]
            prop.onClick (fun _ -> dispatch Test)]]
    
let renderLists (model: Model) (dispatch: Msg -> unit) =
  div [ "box" ] [
    div [ "columns"; "is-mobile"; "is-vcentered" ] [
      div [ "column" ] [
          Html.ul [
            prop.children [
              let reversed = model.Content|> List.rev
              for chat in reversed ->
                Html.li [
                  prop.classes ["box"; "subtitle"]
                  prop.text chat
                ]
            ]
          ]
        ]
      ]
    ]

let inputField (model: Model) (dispatch: Msg -> unit) =
  div [ "field"; "has-addons" ] [
      div [ "control"; "is-expanded"] [
          Html.input [
            prop.classes [ "input"; "is-medium" ]
            prop.valueOrDefault model.TextBox
            prop.onChange (SetTextBox >> dispatch)
          ]
        
      ]
      div ["control"] [
          Html.button [
            prop.classes [ "button"; "is-primary"; "is-medium" ]
            prop.onClick (fun _ -> dispatch SentMsg)
            prop.children [
              Html.i [ prop.classes [ "fa"; "fa-plus" ] ]
            ]
          ]
      ]       
  ] 
      
    
let view (model: Model) dispatch =
    Html.div [
        prop.style [style.padding 20]
        prop.children [
        appTitle
        inputField model dispatch         
        renderLists model dispatch     
        newButton model dispatch
        ]     
    ]           

Program.mkProgram init update view
|> Program.withReactSynchronous "elmish-app"
|> Program.withBridge Shared.endpoint
|> Program.run
