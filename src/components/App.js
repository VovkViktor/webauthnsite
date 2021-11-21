import React, { useEffect } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'

import {
  getIsLoadingSelector,
  getErrorMessage,
  setIsLoading,
  setIsAuth,
  setUser,
  getIsAuthSelector,
  setErrorMessage,
} from '../redux/reducers/profile'

import Auth from '../pages/Auth'
import Profile from '../pages/Profile'
import PrivateRoute from './PrivateRoute'
import Register from '../pages/Register'

function App() {
  const history = useHistory()
  const dispatch = useDispatch()

  const isLoading = useSelector(getIsLoadingSelector)
  const isAuth = useSelector(getIsAuthSelector)
  const errorMessage = useSelector(getErrorMessage)

  const howami = async () => {
    try {
      dispatch(setIsLoading(true))
      const res = await axios({
        url: 'https://learnwebauthn-vb5r9.ondigitalocean.app/api/users/howami',
        method: 'GET',
        withCredentials: true,
      })
      dispatch(setUser(res.data))
      dispatch(setIsAuth(true))
    } catch (error) {
      dispatch(setIsAuth(false))
    } finally {
      dispatch(setIsLoading(false))
    }
  }

  // useEffect(() => {
  //   if (errorMessage) {
  //     setTimeout(() => {
  //       dispatch(setErrorMessage(''))
  //     }, 3000)
  //   }
  // }, [dispatch, errorMessage])

  useEffect(() => {
    if (isAuth) {
      history.push('/')
    }
  }, [isAuth, history])

  useEffect(() => {
    howami()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading)
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    )

  return (
    <div className="App">
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/register" component={Register} />
        <PrivateRoute component={Profile} path="/" />
      </Switch>
      {!!errorMessage && (
        <Alert
          severity="error"
          style={{
            position: 'absolute',
            right: 20,
            top: 20,
          }}
        >
          {errorMessage}
        </Alert>
      )}
    </div>
  )
}

export default App
