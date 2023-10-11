import { Button } from '@mui/material'
import { useToggleValue, useToggleDispatch } from '../contexts/ToggleContext'

const Togglable = (props) => {
  const visible = useToggleValue()
  const dispatchToggle = useToggleDispatch()

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    dispatchToggle({
      type: 'TOGGLE',
      payload: !visible,
    })
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button variant="contained" color="primary" onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={toggleVisibility}
        >
          cancel
        </Button>
      </div>
    </div>
  )
}

export default Togglable
