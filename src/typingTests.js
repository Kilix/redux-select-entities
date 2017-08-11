// @flow
// This is not a source file. This simply ensures that the typings are correct
import { select, entityReducer } from './index';

const state = {
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
