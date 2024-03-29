import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import api from '../api'
import { setIsAuth, setUser } from '../redux/reducers/profile'
import { useErrorHandle } from '../customHook/useErrorHandle'
import {
  publicKeyCredentialToJSON,
  preformatMakeCredReq,
  createCred,
} from '../utils'

const Register = () => {
  const dispatch = useDispatch()
  const handleError = useErrorHandle()
  const history = useHistory()
  const [email, setemail] = useState('')
  const [password, setPassword] = useState('')

  const hanldeRegisterWithPassword = async () => {
    try {
      const result = await api.users.register({
        email,
        password,
      })
      dispatch(setIsAuth(true))
      dispatch(setUser(result.data))
    } catch (error) {
      handleError(error)
    }
  }

  const handleRegisterWebAuthn = async () => {
    try {
      const { data } = await api.users.registerWebAuthnGetCred({ email })

      const publicKeyCredentialCreationOptions = preformatMakeCredReq(data)

      const credentials = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      })

      const credJson = publicKeyCredentialToJSON(credentials)

      const res = await api.users.registerWebAuthnResponce(credJson)

      dispatch(setIsAuth(true))
      dispatch(setUser(res.data))
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div className="container">
      <div className="wrap">
        <Typography
          variant="h4"
          component="h4"
          style={{ marginBottom: '15px' }}
        >
          Register
        </Typography>
        <TextField
          placeholder="email"
          name="email"
          InputProps={{ required: true }}
          style={{ marginBottom: '15px' }}
          type="email"
          value={email}
          onChange={(e) => {
            setemail(e.target.value)
          }}
        />
        <TextField
          placeholder="password"
          name="password"
          InputProps={{ required: true }}
          style={{ marginBottom: '15px' }}
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        //disabled={!password || !email}
        />
        <Button
          variant="text"
          onClick={hanldeRegisterWithPassword}
          disabled={!password || !email}
        >
          Register
        </Button>
        <br />
        <Button
          variant="text"
          onClick={handleRegisterWebAuthn}
          disabled={!email}
        >
          Register with WebAuthn
        </Button>
        <br />
        <Button variant="text" onClick={() => history.goBack()}>
          Back
        </Button>
      </div>
    </div>
  )
}

export default Register
