import {Draft} from 'immer'

export type ActionWithArgumentsApplied<State> = (state: State | Draft<State>) => void | State

export type Actions<State> = {
    [actionName: string]: (...actionArgs: any[]) => ActionWithArgumentsApplied<State>
}

// By using SpecificActions extends Actions<any>, it allows ReturnedActions to be specific to the keys and types involved.
export type ReturnedActions<SpecificActions extends Actions<any>> = {
    [actionName in keyof SpecificActions]: (...actionArgs: Parameters<SpecificActions[actionName]>) => void
}

export type Selectors<State> = {
    [selectorName: string]: (...selectorArgs: any[]) => (state: State) => any
}

export type ReturnedSelectors<SpecificSelectors extends Selectors<any>> = {
    [key in keyof SpecificSelectors]: (...selectorArgs: Parameters<SpecificSelectors[key]>) => (SpecificSelectors[key] extends ((...selectorArgs: any[]) => (state: any) => infer P) ? P : never)
}

export type Options<State, SpecificActions extends Actions<State>, SpecificSelectors extends Selectors<State>> = {
    initialState: State, reducers: SpecificActions, selectors: SpecificSelectors
}
