// @flow
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
