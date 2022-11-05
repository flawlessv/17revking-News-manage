export const SpinReducer=(previousState=true,action)=>{
    let newState=previousState
    switch (action.type) {
        case 'change_isSpin':
            newState=action.data
            return newState
        default:
        }
            return previousState
}
