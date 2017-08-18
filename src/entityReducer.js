// @flow
import { type Map } from './types';

type Action = {
    type: string,
    payload: {
        entities: { [id: string]: Map<*> },
    },
};

type Options<E: Object> = {
    actionTypes?: Array<string>,
    revive?: (entity: any) => E,
    merger?: (a: E, b: E, action: Action) => E,
    normalizeIf?: (action: Action) => boolean,
};

export type Reducer<E: Object> = (state: Map<E>, action: Action) => Map<E>;
function entityReducer<E: Object>(reducer: Reducer<E>, options: Options<E> = {}) {
    function createEntityReducer(name: string): Reducer<E> {
        const {
            actionTypes = [],
            revive = entity => entity,
            // By default, merge the entity from the state and the one from the action's payload
            // eslint-disable-next-line no-unused-vars
            merger = (stateEntity, payloadEntity, action) => ({ ...stateEntity, ...payloadEntity }),
            normalizeIf,
        } = options;

        // The name is required since it is used to find the entities in the payload
        if (typeof name !== 'string') {
            throw new Error('The higher order reducer should be passed a string for name');
        }

        return (state: Map<E> = {}, action: Action): Map<E> => {
            let updatedState = state;

            // Handle the merge of the received entities and the current state
            if (actionTypes.includes(action.type) || (normalizeIf && normalizeIf(action))) {
                const entities = action.payload.entities[name];

                if (entities) {
                    updatedState = Object.keys(entities).reduce(
                        (mergedState: Map<E>, entityId) => ({
                            ...mergedState,
                            // If the entity is already in the state, use the merger function
                            [entityId]: mergedState[entityId]
                                ? merger(mergedState[entityId], revive(entities[entityId]), action)
                                : revive(entities[entityId]),
                        }),
                        state,
                    );
                }
            }

            return reducer(updatedState, action);
        };
    }
    return createEntityReducer;
}
export default entityReducer;
