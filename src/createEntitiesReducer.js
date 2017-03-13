import { combineReducers } from 'redux';

const createEntitiesReducer = entitiesReducerMap => combineReducers(
    Object.keys(entitiesReducerMap).reduce(
        (reducers, reducerName) => ({
            ...reducers,
            [reducerName]: entitiesReducerMap[reducerName](reducerName),
        }),
        {},
    ),
);

export default createEntitiesReducer;
