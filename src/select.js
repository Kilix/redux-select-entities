import curry from 'lodash.curry';

export const customSelect = selectEntities => curry((entityName, state, elementId) => {
    const entityState = selectEntities(state)[entityName];
    if (typeof entityState !== 'object') {
        throw new Error(
            `The getter creator received a state that did not include ${entityName} entities`,
        );
    }

    return entityState[String(elementId)] || null;
});

export default customSelect(state => state.entities);
