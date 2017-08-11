// @flow
/* eslint-disable */
// Struggling with typings in real life
export type Map<E> = Object;

export type EntityState = {
    [id: string]: Map<*>,
};
type State = { entities: EntityState };

type _Select1 = (key: string) => (state: State) => (id: ?number) => *;
type _Select2 = (key: string) => (state: State, id: ?number) => *;
type _Select3 = (key: string, state: State) => (id: ?number) => *;
type _Select4 = (key: string, state: State, id: ?number) => *;

export type Select = _Select1 & _Select2 & _Select3 & _Select4;

type _SelectAll1 = (key: string) => (state: State) => Map<*>;
type _SelectAll2 = (key: string, state: State) => Map<*>;

export type SelectAll = _SelectAll1 & _SelectAll2;

type Where<T: Object> = (state: T) => ?number;
type _SelectWhere1 = <T>(key: string) => (where: Where<T>) => (state: T) => *;
type _SelectWhere2 = <T>(key: string) => (where: Where<T>, state: T) => *;
type _SelectWhere3 = <T>(key: string, where: Where<T>) => (state: T) => *;
type _SelectWhere4 = <T>(key: string, where: Where<T>, state: T) => *;
export type SelectWhere = _SelectWhere1 & _SelectWhere2 & _SelectWhere3 & _SelectWhere4;
