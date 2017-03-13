# redux-select-entities

[![build status](https://img.shields.io/travis/AugustinLF/redux-select-entities.svg)]()
[![codecov coverage](https://codecov.io/gh/AugustinLF/redux-select-entities/branch/master/graph/badge.svg)](https://codecov.io/gh/AugustinLF/redux-select-entities)
[![npm](https://img.shields.io/npm/v/redux-select-entities.svg)]()

Light abstraction over normalizr and reselect to handle normalized entities, using higher-order-reducers.

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
const newState = enhancedTodoReducer(
    state,
    {
        type: 'GET_TODO',
        // This is done for you by normalizr
        payload: {
            entities: {
                1: {
                    id: 1,
                    content: 'be amazing',
                },
            },
        },
    },
)
// This is necessary for entitiesReducer to know where to find the entities in the payload
// It will be done for you by combineReducersWithEntities
('todo');
```

The enhanced reducer automatically normalized the todos for you, by returning a map containing the todos:
```javascript
console.log(newState);
{
    1: { id: 1, content: 'be amazing' }
}

```

| Name | Type | Description |
|:---|:---|:---:|:---|
|`actionTypes`|`Array<string >`|The list of the actions where the reducer should search the normalized entities|
|`revive`|function||
|`merger`|function||


