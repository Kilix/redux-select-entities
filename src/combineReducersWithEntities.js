import { combineReducers } from 'redux';

import createEntitiesReducer from './createEntitiesReducer';

const combineReducersWithEntities = (entitiesReducerMap, reducerMap) => combineReducers({
    entities: createEntitiesReducer(entitiesReducerMap),
    ...reducerMap,
});

export default combineReducersWithEntities;
