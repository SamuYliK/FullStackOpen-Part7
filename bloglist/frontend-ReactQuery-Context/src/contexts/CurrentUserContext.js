import { createContext, useReducer, useContext } from 'react'

const currentUserReducer = (state, action) => {
  switch (action.type) {
    case 'USER':
      return action.payload
    case 'LOGOUT':
      return null
    default:
      return null
  }
}

const CurrentUserContext = createContext()

export const useCurrentUserValue = () => {
  const currentUserAndDispatch = useContext(CurrentUserContext)
  return currentUserAndDispatch[0]
}

export const useCurrentUserDispatch = () => {
  const currentUserAndDispatch = useContext(CurrentUserContext)
  return currentUserAndDispatch[1]
}

export const CurrentUserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(currentUserReducer, null)

  return (
    <CurrentUserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </CurrentUserContext.Provider>
  )
}

export default CurrentUserContext
