import { combineReducers } from 'redux';

const createEntitiesReducer = reducerMap =>
    combineReducers(Object.keys(reducerMap).reduce(
        (reducers, reducerName) => ({
            ...reducers,
            [reducerName]: reducerMap[reducerName](reducerName),
        }),
        {},
    ));

export default createEntitiesReducer;
