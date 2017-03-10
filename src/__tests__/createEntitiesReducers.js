import createEntitiesReducer from '../createEntitiesReducer';

describe('createEntitiesReducer', () => {
    it('should set the name of each entity reducer', () => {
        const todoReducer = jest.fn(() => () => {});
        createEntitiesReducer({
            todo: todoReducer,
        });
        expect(todoReducer).toHaveBeenCalledWith('todo');
    });

    it('should forward the named reducer to combineReducer', () => {
        // the reducer returned by entityReducer
        const realReducer = jest.fn(() => 'bla');
        const todoReducer = () => realReducer;
        const reducer = createEntitiesReducer({
            todo: todoReducer,
        });
        const action = {};
        const newState = reducer({ entities: { todo: 'a' } }, action);
        expect(realReducer).toHaveBeenCalledWith('a', action);
        expect(newState).toEqual({ entities: { todo: 'bla' } });
    });

    it('should handle the other reducers', () => {
        const layoutReducer = jest.fn(() => 'bla');
        const entityReducers = { todo: () => () => null };
        const reducer = createEntitiesReducer(entityReducers, {
            layout: layoutReducer,
        });
        const initialState = {
            entities: { todo: null },
            layout: 'a',
        };
        const action = {};
        const newState = reducer(initialState, action);
        expect(layoutReducer).toHaveBeenCalledWith('a', action);
        expect(newState).toEqual({
            entities: { todo: null },
            layout: 'bla',
        });
    });
});
