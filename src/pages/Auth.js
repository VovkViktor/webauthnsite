import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import {
  setIsAuth,
  setUser,
  getIsAuthSelector,
} from '../redux/reducers/profile'
import {
  publicKeyCredentialToJSON,
  preformatGetAssertReq,
  handleError,
} from '../utils.js'

const Auth = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [email, setemail] = useState('')
  const [password, setPassword] = useState('')
  const isAuth = useSelector(getIsAuthSelector)

  const handleLoginClick = async () => {
    try {
      const res = await axios({
        url: 'https://learnwebauthn-vb5r9.ondigitalocean.app/api/users/login',
        method: 'POST',
        data: {
          email,
          password,
        },
      })
      dispatch(setIsAuth(true))
      dispatch(setUser(res.data))
      localStorage.setItem('token', res.data.token)
    } catch (error) {
      dispatch(setIsAuth(false))
      handleError(error, dispatch)
    }
  }

  const handleClickLoginWithAuthn = async () => {
    try {
      const { data } = await axios({
        url: 'https://learnwebauthn-vb5r9.ondigitalocean.app/api/users/webauthn/login',
        method: 'POST',
        data: { email },
        withCredentials: true,
      })

      const publicKey = preformatGetAssertReq(data)

      const res = await navigator.credentials.get({ publicKey })

      let getAssertionResponse = publicKeyCredentialToJSON(res)

      const { data: userData } = await axios({
        url: 'https://learnwebauthn-vb5r9.ondigitalocean.app/api/users/webauthn/login/response',
        method: 'POST',
        data: getAssertionResponse,
        withCredentials: true,
      })
      if (userData.token) {
        localStorage.setItem('token', userData.token)
        dispatch(setIsAuth(true))
        dispatch(setUser(userData))
      }
    } catch (error) {
      handleError(error, dispatch)
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
          label="Email"
          style={{ marginBottom: '15px' }}
          autoComplete="off"
          value={email}
          onChange={(e) => {
            setemail(e.target.value)
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          autoComplete="off false"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <br />
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
