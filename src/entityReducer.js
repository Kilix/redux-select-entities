const entityReducer = (reducer, options = {}) => (name) => {
    const {
        actionTypes = [],
        revive = entity => entity,
        // By default, replace the entity from the state with the one from the action's payload
        merger = (stateEntity, payloadEntity) => payloadEntity,
    } = options;

    // The name is required since it is used to find the entities in the payload
    if (typeof name !== 'string') {
        throw new Error('The higher order reducer should be passed a string for name');
    }

    return (state = {}, action) => {
        let updatedState = state;

        // Handle the merge of the received entities and the current state
        if (actionTypes.includes(action.type)) {
            const entities = action.payload.entities[name];
            updatedState = Object.keys(entities).reduce(
                (mergedState, entityId) => ({
                    ...mergedState,
                    // If the entity is already in the state, use the merger function
                    [entityId]: mergedState[entityId]
                        ? merger(mergedState[entityId], revive(entities[entityId]), action)
                        : revive(entities[entityId]),
                }),
                state,
            );
        }

        return reducer(updatedState, action);
    };
};

export default entityReducer;
