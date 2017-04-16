export default (state = '', action) => {
    switch (action.type) {
        case 'IS_LOADING':
            return action.isLoading;
        case 'HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}