// @flow
// This is not a source file. This simply ensures that the typings are correct
import { select, entityReducer, selectWhere } from './index';

const state = {
    id: 2,
    entities: {
        todo: {},
    },
};

select('todo', state, 1);

select('todo')(state)(1);

// $FlowFixMe
select(1)(state)(1);

// $FlowFixMe
select(1, 1, {});

select('todo', state);

const userReducer = s => s;
entityReducer(userReducer, {
    actionTypes: ['GET_ONE_USER'],
});

selectWhere('todo', s => s.id, state);

// $FlowFixMe
selectWhere('todo', s => s.foo, state);
