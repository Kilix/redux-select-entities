import { combineReducers } from 'redux';

const createEntitiesReducer = (entitiesReducerMap, reducerMap) => combineReducers({
    entities: combineReducers(
        Object.keys(entitiesReducerMap).reduce(
            (reducers, reducerName) => ({
                ...reducers,
                [reducerName]: entitiesReducerMap[reducerName](reducerName),
            }),
            {},
        ),
    ),
    ...reducerMap,
});

export default createEntitiesReducer;
