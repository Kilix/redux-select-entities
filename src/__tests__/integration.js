import { schema, normalize } from 'normalizr';
import { entityReducer, combineReducersWithEntities, select } from '../index';

const todoSchema = new schema.Entity('todo');

describe('integration test', () => {
    const todoReducer = state => state;
    const entityTodoReducer = entityReducer(todoReducer, {
        actionTypes: ['GET_ONE_TODO'],
    });
    const userReducer = state => state;
    const entityUserReducer = entityReducer(userReducer, {
        actionTypes: ['GET_ONE_USER'],
    });
    const appReducer = combineReducersWithEntities(
        {
            todo: entityTodoReducer,
            user: entityUserReducer,
        },
        {
            // here put the app's other reducers
        },
    );

    it('should initialize all the reducers', () => {
        const initialState = appReducer(undefined, {});
        expect(initialState).toEqual({ entities: { todo: {}, user: {} } });
    });

    it('should normalize the entities', () => {
        const newState = appReducer(undefined, {
            type: 'GET_ONE_TODO',
            payload: normalize({ id: 1, value: 'not a todo' }, todoSchema),
        });
        expect(newState).toEqual({
            entities: {
                user: {},
                todo: {
                    1: { id: 1, value: 'not a todo' },
                },
            },
        });
    });

    it('should select normalized entities', () => {
        const state = appReducer(undefined, {
            type: 'GET_ONE_TODO',
            payload: normalize({ id: 1, value: 'not a todo' }, todoSchema),
        });
        const todo = select('todo', state, 1);
        expect(todo.value).toBe('not a todo');
    });
});
