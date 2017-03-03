import entityReducer from '../entityReducer';
import createEntitiesReducer from '../createEntitiesReducer';

describe('integration test', () => {
    const todoReducer = state => state;
    const entityTodoReducer = entityReducer(todoReducer, {
        actionTypes: ['GET_ONE_TODO'],
    });
    const userReducer = state => state;
    const entityUserReducer = entityReducer(userReducer, {
        actionTypes: ['GET_ONE_USER'],
    });
    const entitiesReducer = createEntitiesReducer({
        todo: entityTodoReducer,
        user: entityUserReducer,
    });

    it('should initialize all the reducers', () => {
        const initialState = entitiesReducer(undefined, {});
        expect(initialState).toEqual({ todo: {}, user: {} });
    });

    it('should normalize the entities', () => {
        const newState = entitiesReducer(undefined, {
            type: 'GET_ONE_TODO',
            payload: {
                entities: {
                    todo: {
                        1: { id: 1, value: 'not a todo' },
                    },
                },
            },
        });
        expect(newState).toEqual({
            user: {},
            todo: {
                1: { id: 1, value: 'not a todo' },
            },
        });
    });
});
