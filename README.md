# useSimpleReducer

`useSimpleReducer` is the **most boilerplate-free way** to use state within a React component.

Here’s a code example

```typescript jsx
import {useSimpleReducer} from 'use-simple-reducer'

const Counter = () => {

    const initialState = {text: ""}
    const [state, {append, replace}, {doubled}] = useSimpleReducer({
        initialState,
        reducers: {
            append: (newText: string) => (state) => { state.text += newText },
            reset: () => (state) => (initialState)
        }, selectors: {
            doubled: () => (state) => (state.text + state.text)
        }
    })

    return <div>
        <p>Text: {state.text}</p>
        <p>Doubled: {doubled()}</p>
        <button onClick={() => append("hehe")}>Add letters</button>
        <button onClick={() => reset()}>Reset</button>
    </div>
}
```

All of it is fully type-checked, and uses [useReducer][] and [Redux Toolkit][] under the hood.

Compare this with using:

- `useState`
- `useReducer` with Redux Toolkit
- [`useComplexState`][use-complex-state]

See the code comparison snippets below.



## Usage

Install the package with:

```
npm install use-simple-reducer
```

Then just import it into your code:

```typescript
import {useSimpleReducer} from "use-simple-reducer";
```

Now you can use `useSimpleReducer` in components like this:

```typescript jsx
import {useSimpleReducer} from 'use-simple-reducer'

const Counter = () => {

    const initialState = {text: ""}
    const [state, {append, replace}, {doubled}] = useSimpleReducer({
        initialState,
        reducers: {
            append: (newText: string) => (state) => { state.text += newText },
            reset: () => (state) => (initialState)
        }, selectors: {
            doubled: () => (state) => (state.text + state.text)
        }
    })

    return <div>
        <p>Text: {state.text}</p>
        <p>Doubled: {doubled()}</p>
        <button onClick={() => append("hehe")}>Add letters</button>
        <button onClick={() => reset()}>Reset</button>
    </div>
}
```


### Parameters

`useSimpleReducer` takes a single object with the following fields

- `initialState`
- `reducers`
- `selectors` (optional)

`reducers` is an object of functions, each of the form

```typescript
(...args) => (state) => { function_body_here }
```

`function_body_here` can either

* return a value to replace `state` entirely (e.g., `return {...state, text: newText)`)
* or mutate `state` directly (e.g., `state.text += newText`).

Internally, `useSimpleReducer` uses Redux Toolkit and Immer to make sure `state` isn’t mutated directly, but rather a modified copy is returned. If you’re not sure why that’s useful, read [Immer’s documentation][Immer]. 

Similarly, `selectors` is an object of functions of the form

```typescript
(...args) => (state) => { function_body_here }
```

that returns a computed value based on `state`.


### Typing

useSimpleReducer is fully typed. In the above code, Typescript will automatically infer that the type of the `(state)` parameter in your reducers and selectors is `{text: string}`.

If you want to be explicit about the State type, you can either use a type assertion:

```typescript jsx
type TodosState = {todos: string[]}

useSimpleReducer({
    initialState: {todos: []} as TodosState,
    ...
})
```

or extract `initialState` to an explicitly-typed variable:

```typescript jsx
type TodosState = {todos: string[]}
const initialState: TodosState = {todos: []}

useSimpleReducer({
    initialState: initialState,
    ...
})
```

> **Why this matters**
>
> You’ll want to use either of these methods when passing `initialState` by itself isn’t enough to let Typescript infer the type of your state correctly. For example, if you pass
> 
> ```typescript jsx
> useSimpleReducer({
>     initialState: {todos: []},
>     ...
> })
> ```
> 
> Typescript doesn’t know what type `todos` is an array of, and assumes it to be `any[]` instead of `string[]` like you may have intended, and it will throw an error when your reducers or selectors attempt to access `todos` like an array of strings.


> **Why can’t you pass in a generics parameter like `useSimpleReducer<TodosState>(...)`?**
>
> _You can, but `useSimpleReducer` uses other generics parameters too, and if you specify one generics parameters, Typescript makes you specify the rest, which gets bulky._




### Protip

You can pull out the `useSimpleReducer(...)` code into your own custom hook, to keep your components even cleaner and better adhere to the Single Responsibility Principle.

```typescript jsx
import {useSimpleReducer} from 'use-simple-reducer'

const useCounter = () => {
    
    const initialState = {text: ""}
    const reducers = {
        append: (newText: string) => (state) => { state.text += newText },
        reset: () => (state) => (initialState)
    }
    const selectors = {
        doubled: () => (state) => (state.text + state.text)
    }
    
    return useSimpleReducer({initialState, reducers, selectors})
}

const Counter = () => {

    const [state, {append, replace}, {doubled}] = useCounter()

    return <div>
        <p>Text: {state.text}</p>
        <p>Doubled: {doubled()}</p>
        <button onClick={() => append("hehe")}>Add letters</button>
        <button onClick={() => reset()}>Reset</button>
    </div>
}
```


## Why this exists

TO BE WRITTEN


[useReducer]: https://reactjs.org/docs/hooks-reference.html#usereducer
[Redux Toolkit]: https://redux-toolkit.js.org
[use-complex-state]: https://github.com/xolvio/use-complex-state
[Immer]: https://immerjs.github.io/immer/

