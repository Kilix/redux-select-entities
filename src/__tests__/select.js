import select from '../select';

describe('select', () => {
    const createTodoGetter = select('todo');

    it('should return a function', () => {
        expect(typeof createTodoGetter).toBe('function');
    });

    it('should throw when passed a state that does not contain the wanted entity type', () => {
        expect(() => {
            createTodoGetter({ entities: { contacts: {} } }, 1);
        }).toThrow(
            new Error('The getter creator received a state that did not include todo entities'),
        );
    });

    const todoEntities = {
        1: { id: 1, content: 'yep' },
    };
    const getTodo = createTodoGetter({ entities: { todo: todoEntities } });
    it('should return the corresponding entity', () => {
        expect(typeof getTodo).toBe('function');
        expect(getTodo(1)).toEqual({ id: 1, content: 'yep' });
    });

    it('should return null if the entity does not exist', () => {
        const unknownTodo = getTodo(2);
        expect(unknownTodo).toBe(null);
    });
});
