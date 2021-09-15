import {useReducer} from "react"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {Actions, ActionWithArgumentsApplied, ReturnedActions, ReturnedSelectors, Selectors} from './types'

export type {Actions, Selectors}

const useSimpleReducer =
    // By using "SpecificActions extends Actions<State>", it narrows to the specific action names and types involved.
    // Same with "SpecificSelectors extends Selectors<State>".
    <State, SpecificActions extends Actions<State>, SpecificSelectors extends Selectors<State>>
        // TODO: The "as SpecificSelectors" type assertion is a bit sketch. There must be a better way of making "selectors" optional.
        // Right now, the consequence is that when selectors is not passed, then returnedSelectors is of a too wide type, that can be destructured into anything.
    (initialState: State, actions: SpecificActions, selectors: SpecificSelectors = {} as SpecificSelectors) => {

        const slice = createSlice({
            name: "__name",
            initialState,
            reducers: {
                dummyAction: (state, action: PayloadAction<ActionWithArgumentsApplied<State>>) => (action.payload(state)),
            },
        })

        const dummyAction = slice.actions.dummyAction

        const [state, dispatch] = useReducer(slice.reducer, initialState)

        // Object.fromEntries isn’t typed well; hence, I have to use the ReturnedActions<SpecificActions> type assertion.
        const returnedActions = Object.fromEntries(Object.entries(actions).map(
            ([actionName, action]) => ([actionName, (...actionArgs) => dispatch(dummyAction(action(...actionArgs)))]),
        )) as ReturnedActions<SpecificActions>

        const returnedSelectors = Object.fromEntries(Object.entries(selectors).map(
            ([selectorName, selector]) => ([selectorName, (...selectorArgs) => selector(...selectorArgs)(state)]),
        )) as ReturnedSelectors<SpecificSelectors>

        // The “as const” narrows to the specific keys and types involved.
        return [state, returnedActions, returnedSelectors] as const
    }

export default useSimpleReducer
