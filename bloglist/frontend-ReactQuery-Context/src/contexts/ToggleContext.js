import { createContext, useReducer, useContext } from 'react'

const toggleReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE':
      return action.payload
    default:
      return false
  }
}

const ToggleContext = createContext()

export const useToggleValue = () => {
  const toggleAndDispatch = useContext(ToggleContext)
  return toggleAndDispatch[0]
}

export const useToggleDispatch = () => {
  const toggleAndDispatch = useContext(ToggleContext)
  return toggleAndDispatch[1]
}

export const ToggleContextProvider = (props) => {
  const [toggle, toggleDispatch] = useReducer(toggleReducer, null)

  return (
    <ToggleContext.Provider value={[toggle, toggleDispatch]}>
      {props.children}
    </ToggleContext.Provider>
  )
}

export default ToggleContext
