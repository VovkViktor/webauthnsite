import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import api from '../api'
import {
  setIsAuth,
  setUser,
  getIsAuthSelector,
} from '../redux/reducers/profile'
import { publicKeyCredentialToJSON, preformatGetAssertReq } from '../utils.js'
import { useErrorHandle } from '../customHook/useErrorHandle'

const Auth = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [email, setemail] = useState('')
  const [password, setPassword] = useState('')
  const isAuth = useSelector(getIsAuthSelector)
  const handleError = useErrorHandle()

  const handleLoginClick = async () => {
    try {
      const res = await api.users.login({
        email,
        password,
      })

      dispatch(setIsAuth(true))
      dispatch(setUser(res.data))
    } catch (error) {
      dispatch(setIsAuth(false))
      handleError(error)
    }
  }

  const handleClickLoginWithAuthn = async () => {
    try {
      const { data } = await api.users.loginWebAuthnGetCred({ email })

      console.log('Response data for webauthn login', data)

      const publicKey = preformatGetAssertReq(data)

      console.log('publicKey', publicKey)

      const res = await navigator.credentials.get({ publicKey })

      console.log('responce from webauth api', res)

      let getAssertionResponse = publicKeyCredentialToJSON(res)

      console.log('getAssertionResponse', getAssertionResponse)

      const { data: userData } = await api.users.loginWebAuthnResponce(
        getAssertionResponse
      )

      dispatch(setIsAuth(true))
      dispatch(setUser(userData))
    } catch (error) {
      handleError(error)
    }
  }

  const handleClickRegister = () => {
    history.push('/register')
  }

  useEffect(() => {
    if (isAuth) {
      history.push('/')
    }
  }, [history, isAuth])

  return (
    <div className="container">
      <div className="wrap">
        <Typography
          variant="h4"
          component="h4"
          style={{ marginBottom: '15px' }}
        >
          Login
        </Typography>
        <TextField
          placeholder="email"
          style={{ marginBottom: '15px' }}
          value={email}
          onChange={(e) => {
            setemail(e.target.value)
          }}
          type="email"
        />
        <TextField
          placeholder="password"
          type="password"
          value={password}
          style={{ marginBottom: '15px' }}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <Button
          variant="text"
          onClick={handleLoginClick}
          disabled={!password || !email}
        >
          Login
        </Button>
        <br />
        <Button
          variant="text"
          onClick={handleClickLoginWithAuthn}
          disabled={!email}
        >
          Login with WebAuthn
        </Button>
        <br />
        <Button variant="text" onClick={handleClickRegister}>
          Register
        </Button>
      </div>
    </div>
  )
}

export default Auth
