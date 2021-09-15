# useSimpleReducer

`useSimpleReducer` is the **most boilerplate-free way possible** to use reducers within a React component.

It’s a simple wrapper on top of `useReducer` and Redux Toolkit.

Why this is cool:

🌟 It makes the power of reducers as easy to use as `useState`.  
🌟 Use reducers in all your components—it’s so lightweight.  


## Overview

Here’s a code example

```typescript jsx
import {useSimpleReducer} from 'use-simple-reducer'

const TextDoubler = () => {

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

Code snippet comparisons are below.

The point is making it easy & light-weight to use the [Commands and Queries][Command-Query] design pattern. State is
always modified through explicit Command functions, and accessed through Query functions.

## Usage

Install the package with:

```
npm install use-simple-reducer
```

Then just import it into your code:

```typescript
import {useSimpleReducer} from "use-simple-reducer"
```

Now you can use `useSimpleReducer` in components like this:

```typescript jsx
import {useSimpleReducer} from 'use-simple-reducer'

const TextDoubler = () => {

    const initialState = {
        text: ""
    }
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

Internally, `useSimpleReducer` uses Redux Toolkit and Immer to make sure `state` isn’t mutated directly, but rather a
modified copy is returned. If you’re not sure why that’s useful, read [Immer’s documentation][Immer].

Similarly, `selectors` is an object of functions of the form

```typescript
(...args) => (state) => { function_body_here }
```

that returns a computed value based on `state`.

### Typing

`useSimpleReducer` is fully typed. In the above code, Typescript will automatically infer the type of the `(state)`
parameter in your reducers and selectors as `{text: string}`.

If you want to be explicit about the State type, you can either use a type assertion:

```typescript jsx
type TodosState = { todos: string[] }

useSimpleReducer({
    initialState: {todos: []} as TodosState,
    ...
})
```

or extract `initialState` to an explicitly-typed variable:

```typescript jsx
type TodosState = { todos: string[] }
const initialState: TodosState = {todos: []}

useSimpleReducer({
    initialState: initialState,
    ...
})
```

> **Why this matters**
>
> You’ll want to use either of these methods when passing `initialState` isn’t enough to let Typescript infer the type of your state correctly. For example, if you pass
>
> ```typescript jsx
> useSimpleReducer({
>     initialState: {todos: []},
>     ...
> })
> ```
>
> Typescript doesn’t know what type `todos` is an array of, and assumes it to be `any[]`. This will then throw an error when your reducers or selectors attempt to access `todos` like an array of strings.


> **Why can’t you pass in a generics parameter like `useSimpleReducer<TodosState>(...)`?**
>
> _You can, but `useSimpleReducer` uses other generics parameters too, and if you specify one generics parameters, Typescript makes you specify the rest, which gets bulky._

### Protip

You can pull out the `useSimpleReducer(...)` code into your own custom hook, to keep your components even cleaner and
better adhere to the Single Responsibility Principle.

```typescript jsx
import {useSimpleReducer} from 'use-simple-reducer'

const useTextDoubler = () => {

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

const TextDoubler = () => {

    const [state, {append, replace}, {doubled}] = useTextDoubler()

    return <div>
        <p>Text: {state.text}</p>
        <p>Doubled: {doubled()}</p>
        <button onClick={() => append("hehe")}>Add letters</button>
        <button onClick={() => reset()}>Reset</button>
    </div>
}
```

## Comparison with alternatives

Consider the following code snippet written with `useSimpleReducer`

```typescript jsx
import {useSimpleReducer} from 'use-simple-reducer'

const TodosApp = () => {

    type State = { todos: string[] }
    const initialState: State = {todos: []}

    const [state, {addTodo, setNthTodo}] = useSimpleReducer({
        initialState,
        reducers: {
            addTodo: () => (state) => { state.todos.push(todo) },
            setNthTodo: (index: number, todo: string) => (state) => { state.todos[index] = todo },
        }, selectors: {
            lastTodo: () => (state) => (state.todos.at(-1))
        }
    })

    return <div>
        <ol>
            {state.todos.map((todo, i) => (<li key={i}>
                <input value={todo} onChange={(event) => setNthTodo(i, event.target.value)}/>
            </li>))}
        </ol>
        <button onClick={() => addTodo()}>Add todo</button>
    </div>
}
```

---

If it was written with `useReducer` and Redux Toolkit, it would look like:

```typescript jsx
import {useReducer} from 'react'
import {createSlice} from '@reduxjs/toolkit'

const TodosApp = () => {

    type State = { todos: string[] }
    const initialState: State = {todos: []}

    const slice = createSlice({
        name: "todos",
        initialState,
        reducers: {
            addTodo: (state) => { state.todos.push(todo) },
            setNthTodo: (state, index: number, todo: string) => { state.todos[i] = todo },
        },
    })

    const [state, dispatch] = useReducer(slice.reducer, initialState)

    return <div>
        <ol>
            {state.todos.map((todo, i) => (<li key={i}>
                <input value={todo}
                       onChange={(event) => dispatch(slice.actions.setNthTodo({index: i, todo: event.target.value}))}/>
            </li>))}
        </ol>
        <button onClick={() => dispatch(slice.actions.addTodo())}>Add todo</button>
    </div>
}
```

Notice the improvements with `useSimpleReducer`:

1. There’s no need for a `name` field. Since we are not combining multiple slices together, like you would with redux,
   this is just unnecessary noise.
2. You pass `initialState` just once instead of twice, and you can define it inline.
3. No need to wrap the actions with dispatches. That wrapping is ugly, noisy, and easy to mess up (no warning if you
   call the action without a dispatch—might be a confusing bug to debug).
4. The actions (and selectors, if any) are returned right there in an easy to capture way.
5. When actions take multiple arguments, you can pass them in naturally, like `setNthTodo(i, event.target.value)`,
   instead of having to wrap them in an object like `setNthTodo({index: i, todo: event.target.value})`. This is also
   nice, because if you use IDE refactoring tools, they will rename the parameters correctly in the first case, but
   might miss the second case.
6. There’s built-in functionality for selectors.

---

If the code snippet was written with [`useComplexState`][use-complex-state] (a similar library to help reduce
boilerplate), it would look like:

```typescript jsx
import {useComplexState} from 'use-complex-state'

const TodosApp = () => {

    type State = { todos: string[] }
    const initialState: State = {todos: []}

    const [state, {addTodo, setNthTodo}] = useComplexState({
        initialState,
        reducers: {
            addTodo: (state) => { state.todos.push(todo) },
            setNthTodo: (state, index: number, todo: string) => { state.todos[index] = todo },
        },
    })

    return <div>
        <ol>
            {state.todos.map((todo, i) => (<li key={i}>
                <input value={todo} onChange={(event) => setNthTodo({index: i, todo: event.target.value})}/>
            </li>))}
        </ol>
        <button onClick={() => addTodo()}>Add todo</button>
    </div>
}
```

While points 1–4 are addressed, points 5–6 are not.

---

If the code snippet was written with `useState`, it might look like:

```typescript jsx
import {produce} from 'immer'

const TodosApp = () => {

    type State = { todos: string[] }
    const initialState: State = {todos: []}

    const [state, setState] = useState(initialState)
    const addTodo = () => {
        setState(produce(state, (draft) => { state.todos.push(todo) }))
    }
    const setNthTodo = (index: number, todo: string) => {
        setState(produce(state, (draft) => { state.todos[index] = todo }))
    }
    const lastTodo = () => (state.todos.at(-1))

    return <div>
        <ol>
            {state.todos.map((todo, i) => (<li key={i}>
                <input value={todo} onChange={(event) => setNthTodo(i, event.target.value)}/>
            </li>))}
        </ol>
        <button onClick={() => addTodo()}>Add todo</button>
    </div>
}
```

In React, it’s important not to mutate state directly, but rather to use `setState`. Thus, you would either have to wrap
your action function with `produce(...)` from [Immer][], or make sure it doesn’t accidentally mutate the state. This is
noisy and easy to get wrong (can lead to difficult to debug behaviours).

In comparison, `useSimpleReducer` makes it clean and safe to work with state. It also groups together the functionality
around a bit of state in a convenient way.


[useReducer]: https://reactjs.org/docs/hooks-reference.html#usereducer

[Redux Toolkit]: https://redux-toolkit.js.org

[use-complex-state]: https://github.com/xolvio/use-complex-state

[Immer]: https://immerjs.github.io/immer/

[Command-Query]: https://khalilstemmler.com/articles/oop-design-principles/command-query-separation/ 

