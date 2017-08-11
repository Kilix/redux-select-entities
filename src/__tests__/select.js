import { select, customSelect, selectAll, customSelectAll, selectWhere } from '../select';

describe('customSelect', () => {
    const selectData = customSelect(state => state.data);
    const createTodoGetter = selectData('todo');

    it('should return a function', () => {
        expect(typeof createTodoGetter).toBe('function');
    });

    it('should throw when passed a state that does not contain the wanted entity type', () => {
        expect(() => {
            createTodoGetter({ data: { contacts: {} } }, 1);
        }).toThrow(
            new Error('The getter creator received a state that did not include todo entities'),
        );
    });

    const todoEntities = {
        1: { id: 1, content: 'yep' },
    };
    const getTodo = createTodoGetter({ data: { todo: todoEntities } });
    it('should return the corresponding entity', () => {
        expect(typeof getTodo).toBe('function');
        expect(getTodo(1)).toEqual({ id: 1, content: 'yep' });
    });

    it('should return null if the entity does not exist', () => {
        const unknownTodo = getTodo(2);
        expect(unknownTodo).toBe(null);
    });
});

describe('customSelectAll', () => {
    const getAllData = customSelectAll(state => state.data);

    it('should throw when passed a state that does not contain the wanted entity type', () => {
        expect(() => {
            getAllData('todo', { data: { contacts: {} } });
        }).toThrow(
            new Error('The getter creator received a state that did not include todo entities'),
        );
    });

    it('should return the map of entities', () => {
        const map = { 1: { content: 1 } };
        const todoMap = getAllData('todo', { data: { todo: map } });
        expect(todoMap).toBe(map);
    });
});

describe('select', () => {
    it('should look for the entities in state.entities', () => {
        const todo = select('todo', { entities: { todo: { 1: { content: 1 } } } }, 1);
        expect(todo.content).toBe(1);
    });
});

describe('selectAll', () => {
    it('should look for the entities in state.entities', () => {
        const todoMap = {};
        const todos = selectAll('todo', { entities: { todo: todoMap } });
        expect(todos).toBe(todoMap);
    });
});

describe('selectWhere', () => {
    it('should query an entity with a function', () => {
        const state = {
            id: 1,
            entities: {
                user: {
                    1: { id: 1, name: 'John' },
                },
            },
        };
        const john = selectWhere('user', s => s.id, state);
        expect(john.name).toBe('John');
    });
});
