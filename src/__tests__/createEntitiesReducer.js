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
        const newState = reducer({ todo: 'a' }, action);
        expect(realReducer).toHaveBeenCalledWith('a', action);
        expect(newState).toEqual({ todo: 'bla' });
    });
});
