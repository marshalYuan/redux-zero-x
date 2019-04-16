import {Store, IStore} from "./store"

type ArgumentTypes<T> = T extends (... args: infer U ) => infer R ? U: never
type ReplaceReturnType<T, TNewReturn> = (...a: ArgumentTypes<T>) => TNewReturn
type InnerFuction = keyof IStore<{}>
type PickAction<T> = Pick<T, Exclude<keyof T, InnerFuction>>

export type ActionsExclude<T extends Store, EX extends keyof PickAction<T> > = {
  [P in keyof PickAction<T>]: P extends EX ? T[P] : ReplaceReturnType<T[P], void>
}
export type Actions<T extends Store> = {
  [P in keyof PickAction<T>]: ReplaceReturnType<T[P], void>
}