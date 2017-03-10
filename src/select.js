import curry from 'lodash.curry';

const select = curry((entityName, state, elementId) => {
    const entityState = state.entities[entityName];
    if (typeof entityState !== 'object') {
        throw new Error(
            `The getter creator received a state that did not include ${entityName} entities`,
        );
    }

    return entityState[String(elementId)] || null;
});

export default select;
