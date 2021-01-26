const initState = {
  value: 'x1',
};
  
const reducer = (state = initState, action) => {
  console.log('reducer:', state, action);
  if (action.type === 'send_type') {
    return Object.assign({}, state, action);
  }
  return state;
};
  
export default reducer;
