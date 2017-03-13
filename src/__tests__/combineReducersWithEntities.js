import combineReducersWithEntities from '../combineReducersWithEntities';

describe('combineReducersWithEntities', () => {
    it('should handle the other reducers', () => {
        const layoutReducer = jest.fn(() => 'bla');
        const entityReducers = { todo: () => () => null };
        const reducer = combineReducersWithEntities(entityReducers, {
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

    it("should map the entities reducers to the 'entities' key", () => {
        const realReducer = jest.fn(() => 'bla');
        const todoReducer = () => realReducer;
        const reducer = combineReducersWithEntities({
            todo: todoReducer,
        });
        const action = {};
        const newState = reducer({ entities: { todo: 'a' } }, action);
        expect(realReducer).toHaveBeenCalledWith('a', action);
        expect(newState).toEqual({ entities: { todo: 'bla' } });
    });
});
