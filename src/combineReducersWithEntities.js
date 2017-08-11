// @flow
import { combineReducers } from 'redux';

import createEntitiesReducer, { type EntitiesReducerMap } from './createEntitiesReducer';

const combineReducersWithEntities = (
    entitiesReducerMap: EntitiesReducerMap,
    reducerMap: Object,
): any => combineReducers({
        entities: createEntitiesReducer(entitiesReducerMap),
        ...reducerMap,
    });

export default combineReducersWithEntities;
