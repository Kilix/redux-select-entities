// @flow
import { combineReducers } from 'redux';

import type { Reducer } from './entityReducer';

export type EntitiesReducerMap = { [string]: (name: string) => Reducer<*> };

const createEntitiesReducer = (entitiesReducerMap: EntitiesReducerMap) => combineReducers(
    Object.keys(entitiesReducerMap).reduce(
        (reducers, reducerName) => ({
            ...reducers,
            [reducerName]: entitiesReducerMap[reducerName](reducerName),
        }),
        {},
    ),
);

export default createEntitiesReducer;
