import curry from 'lodash.curry';

const getEntities = state => state.entities;

const customSelectAll = selectEntities => curry((entityName, state) => {
    const entityState = selectEntities(state)[entityName];
    if (typeof entityState !== 'object') {
        throw new Error(
            `The getter creator received a state that did not include ${entityName} entities`,
        );
    }

    return entityState;
});
const selectAll = customSelectAll(getEntities);

const customSelect = selectEntities => curry((entityName, state, elementId) => {
    const entityState = customSelectAll(selectEntities)(entityName, state);

    return entityState[String(elementId)] || null;
});
const select = customSelect(getEntities);

export { select, customSelect, selectAll, customSelectAll };
