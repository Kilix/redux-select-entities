# redux-select-entities

[![build status](https://travis-ci.org/Kilix/redux-select-entities.svg)](https://travis-ci.org/Kilix/redux-select-entities)
[![codecov coverage](https://codecov.io/gh/kilix/redux-select-entities/branch/master/graph/badge.svg)](https://codecov.io/gh/kilix/redux-select-entities)
[![npm](https://img.shields.io/npm/v/redux-select-entities.svg)]()

Light abstraction to use with [normalizr](https://github.com/paularmstrong/normalizr/) to handle normalized entities, using higher-order-reducers.

## Getting Started
Install `redux-select-entities` via npm:
```
$ npm install --save redux-select-entities
```

First, you'll want to create a reducer for one of your entities.
```javascript
import { entityReducer } from 'redux-select-entities';

const todoReducer = (state, action) => {
    // the business logic you need to handle
};

const enhancedTodoReducer = entityReducer(todoReducer, options);
```

You can then, instead of using `redux`'s `combineReducers` at the root of your reducers, use `combineReducersWithEntities`. It takes two parameters, first your entities reducers, and then your usual reducers.
```javascript
import { createStore } from 'redux';
import { combineReducersWithEntities } from 'redux-select-entities';

const appReducer = combineReducersWithEntities(
    {
        todo: enhancedTodoReducer,
    },
    {
        // all your other reducers
        auth: authReducer,
        layout: layoutReducer,
    },
);
const store = createStore(
    reducer,
);
```

You now have a state which has the following shape:
```javascript
{
    entities: {
        todo: {} // your normalized todos in a map
    },
    auth: authState,
    layout: layoutState,
}
```
This lets you use the `select` function to get any entity from your state. By calling `select('todo', state, 1)`, you'll get the todo of id 1.

## Usage
The most important part of the API is done by the `entityReducer` [higher-order reducer](http://redux.js.org/docs/recipes/reducers/SplittingReducerLogic.html#splitting-up-reducer-logic). It takes a reducer and an optional option parameter (without any options, the higher-order reducer won't do anything for you beside initializing the state).

```javascript
// No need to specify the default state, it will be done by the entitiesReducer
const todoReducer = (state, action) => {
    switch action.type: {
        case DELETE_TODO: {
            const {todoId} = action.payload;
            const newState = Object.assign({}, state);
            delete newState[todoId];
            return newState;
        }
    }
};
const enhancedTodoReducer = entitiesReducer(
    todoReducer,
    {
        actionTypes: ['GET_TODO'],
    },
);

const appReducer = combineWithEntitiesReducer({todo: enhancedTodoReducer});

const newState = appReducer(
    state,
    {
        type: 'GET_TODO',
        payload: normalize({ id: 1, content: 'be amazing' }, new schema.Entity('todo')),
    },
);
```

The enhanced reducer automatically normalized the todos for you, by returning a map containing the todos:
```javascript
console.log(newState.entities.todo);
{
    1: { id: 1, content: 'be amazing' }
}
```
While the structure of the entities section of the state is public (any breaking change would mean a major semver bump), you are encouraged to use the `select` and `selectAll` functions to retrieve entities.

```javascript
select('todo', newState, 1); // { id: 1, content: 'be amazing' }
selectAll('todo', newState); // { 1: { id: 1, content: 'be amazing' } }
```
`selectAll` is mostly useful if you need to retrieve some entities with something else than their id. For instance:
```javascript
const todoMap = selectAll('todo', state);

// This gives you an array containing all the todos of the todoMap that are done
Object.values(todoMap).filter(
    (todo) => todo.done === true,
)
```
This kind of pattern works well with reselect's API, by letting you do things like:
```javascript
const getConnectedUserTodos = createSelector(
    [
        selectAll('todo'),
        getConnectedUserId, // globalState => id
    ],
    // As long as neither the todos, neither the userId changes, the following function
    // won't be called
    (todoMap, userId) => Object.values(todoMap).filter(todo => todo.createdBy === userId),
)
```

## API

### entityReducer(reducer, options)
Takes first the reducer function, and an optional object to configure how the normalization behavior. The reducer function will be called for each action, as if it was not enhanced by entityReducer, but the state passed to the reducer will first pass through the higher-order reducer, where the normalization is handled.

Option Name     |   Type      | Default       | Description
--------------------|--------------|--------------|--------------------------------
actionTypes     |   array       |   [ ]      |   the list of the actions where the reducer should search the normalized entities
revive          |   function    |       |   if set, each entity to normalize will pass through this function before being set in the state
merger          |   function    | merge  |   If an entity to normalize is already set in the state, the merger function will be called with first the entity from the state, then the one from the action, and finally the whole action. The return value of the function will be set in the state.

`entityReducer` does not return directly the enhanced reducer, but a function that take a single string parameter, that is the name used to declare the normalization schema (in this example, `new schema.Entity('todo')`, the name is `'todo`). This function returns the enhanced reducer. Usually, you won't have to pass the name manually, since `combineReducersWithEntities` (through a call to `createEntitiesReducer`) takes care of it.

### combineReducersWithEntities(entitiesReducerMap, reducerMap)
A wrapper around redux's `combineReducers` to create the main app reducer, that both handles the app's reducers, and the entities ones. The first parameter is an object litteral where each key is the name of an entity (see `entityReducer` doc) and the value the function returned by `entityReducer`. The second parameter is the map of the reducers, the one that would usually passed to `combineReducers`.

### createEntitiesReducer(entitiesReducerMap)
A wrapper around redux's `combineReducers` to create the entities reducer. Its parameter is an object litteral where each key is the name of an entity (see `entityReducer` doc) and the value the function returned by `entityReducer`.

This function is exposed for people who don't want to bind the entities to the `entities` key of the state.

### select(entityName, state, entityId) (this function is [curried](https://lodash.com/docs/4.17.4#curry))
Returns the entity corresponding if it exists, null if it doesn't.

### selectAll(entityName, state) (this function is [curried](https://lodash.com/docs/4.17.4#curry))
Returns the map of entities corresponding.

### customSelect(selectEntitiesState)
Takes a function returning the section of the state where the entities are stored. Return a method with the same signature and behavior than select. `customSelect(state => state.entities)(...)` is equivalent to `select(...)`.

### customSelectAll(selectEntitiesState)
Takes a function returning the section of the state where the entities are stored. Return a method with the same signature and behavior than selectAll. `customSelectAll(state => state.entities)(...)` is equivalent to `selectAll(...)`.
