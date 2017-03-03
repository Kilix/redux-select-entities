import { schema, normalize } from 'normalizr';

import entityReducer from '../entityReducer';

const todoSchema = new schema.Entity('todo');

describe('entityReducer', () => {
    it('should return a reducer', () => {
        const reducer = () => {};
        const hor = entityReducer(reducer)('todo');
        expect(typeof hor).toBe('function');
    });

    it('should forward the state and the action to the passed reducer', () => {
        const newState = {};
        const reducer = jest.fn(() => newState);
        const hor = entityReducer(reducer)('todo');
        const state = {};
        const action = {};
        const returnedState = hor(state, action);
        expect(reducer).toHaveBeenCalledWith(state, action);
        expect(returnedState).toBe(newState);
    });

    it('should initialize the state with an empty object', () => {
        const reducer = state => state;
        const hor = entityReducer(reducer)('todo');
        const initialState = hor(undefined, {});
        expect(initialState).toEqual({});
    });

    describe('configuration', () => {
        it('should throw if name is not a string', () => {
            expect(() => {
                entityReducer(() => {})(1);
            }).toThrow(new Error(
                'The higher order reducer should be passed a string for name',
            ));
        });
    });

    describe('normalization', () => {
        const reducer = state => state;
        const actionTypes = [
            'GET_ONE_TODO',
            'GET_TODO_LIST',
        ];
        const hor = entityReducer(reducer, { actionTypes })('todo');
        const todo1 = { id: 1, content: 'do not forget' };
        const getOneTodo = {
            type: 'GET_ONE_TODO',
            payload: normalize(todo1, todoSchema),
        };
        const stateAfterOneTodo = hor(undefined, getOneTodo);

        it('should normalize the entities found in the allowed actions', () => {
            expect(stateAfterOneTodo[1]).toEqual(todo1);
        });

        const todo2 = { id: 2, content: 'hmmm' };
        const todo3 = { id: 3, content: 'nope' };
        const getTodoList = {
            type: 'GET_TODO_LIST',
            payload: normalize([todo2, todo3], [todoSchema]),
        };

        const stateAfterTodoList = hor(stateAfterOneTodo, getTodoList);
        it('should normalize subsequent actions', () => {
            expect(stateAfterTodoList[2]).toEqual(todo2);
            expect(stateAfterTodoList[3]).toEqual(todo3);
        });

        it('should change previsouly loaded entities', () => {
            expect(stateAfterTodoList[1]).toEqual(todo1);
        });

        it('should not mutate the state', () => {
            hor(stateAfterOneTodo, getTodoList);
            expect(stateAfterOneTodo[2]).toBe(undefined);
        });
    });

    it('should pass the normalized entities through the revive function', () => {
        const reducer = state => state;
        const hor = entityReducer(reducer, {
            actionTypes: ['GET_ONE_TODO'],
            revive: todo => ({ ...todo, revived: true }),
        })('todo');
        const getOneTodo = {
            type: 'GET_ONE_TODO',
            payload: normalize({ id: 1, content: 'do not forget' }, todoSchema),
        };
        const state = hor(undefined, getOneTodo);
        expect(state[1].revived).toBe(true);
    });

    it('should use the optional merger function to solve conflicts', () => {
        const reducer = state => state;
        const hor = entityReducer(reducer, {
            actionTypes: ['GET_ONE_TODO'],
            merger: (stateTodo, payloadTodo) => ({ ...stateTodo, value: payloadTodo.value }),
        })('todo');
        const stateWithInitialTodo = hor(undefined, {
            type: 'GET_ONE_TODO',
            payload: normalize({ id: 1, content: 'initial', value: 1 }, todoSchema),
        });
        const stateAfterNextTodo = hor(stateWithInitialTodo, {
            type: 'GET_ONE_TODO',
            payload: normalize({ id: 1, content: 'new', value: 2 }, todoSchema),
        });
        const todo = stateAfterNextTodo[1];
        expect(todo.content).toBe('initial');
        expect(todo.value).toBe(2);
    });
});
