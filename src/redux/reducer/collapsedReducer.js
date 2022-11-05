export const collapsedReducer=(previousState=false,action)=>{
    let newState=previousState
    switch (action.type) {
        case 'change_isCollapsed':
            newState=!newState
            return newState
        default:
        }
            return previousState
}
