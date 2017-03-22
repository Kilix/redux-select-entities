// @flow
import { combineReducers } from 'redux';

import createEntitiesReducer, { type EntitiesReducerMap } from './createEntitiesReducer';

type ReducerMap<T> = { [string]: (state: T, action: Object) => T };

const combineReducersWithEntities = <T: Object>(
    entitiesReducerMap: EntitiesReducerMap,
    reducerMap: ReducerMap<T>,
) => combineReducers({
        entities: createEntitiesReducer(entitiesReducerMap),
        ...reducerMap,
    });

export default combineReducersWithEntities;
