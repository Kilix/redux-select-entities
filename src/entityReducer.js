const entityReducer = (reducer, options = {}) => (name) => {
    const {
    actionTypes = [],
    revive = entity => entity,
    merger = (stateEntity, payloadEntity) => payloadEntity,
  } = options;

    if (typeof name !== 'string') {
        throw new Error('The higher order reducer should be passed a string for name');
    }

    // TODO considers making it a named function for better stack traces
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
                        ? merger(
                            mergedState[entityId],
                            revive(entities[entityId]),
                        )
                        : revive(entities[entityId])
                    ,
                }),
                state,
            );
        }

        return reducer(updatedState, action);
    };
};

export default entityReducer;
