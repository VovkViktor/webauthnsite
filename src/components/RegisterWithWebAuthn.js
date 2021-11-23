import React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setIsAuth, setUser } from '../redux/reducers/profile'
import {
  publicKeyCredentialToJSON,
  preformatMakeCredReq,
  createCred,
} from '../utils'
import { useErrorHandle } from '../customHook/useErrorHandle'

const RegisterWithWebAuthn = () => {
  const dispatch = useDispatch()
  const handleError = useErrorHandle()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const _email = e.target.email.value

    try {
      const { data } = await axios({
        url: 'https://learnwebauthn-vb5r9.ondigitalocean.app/api/users/webauthn/create',
        method: 'POST',
        data: { email: _email },
        withCredentials: true,
      })

      const publicKeyCredentialCreationOptions = preformatMakeCredReq(data)

      const credentials = await createCred(publicKeyCredentialCreationOptions)

      await handleResponce(credentials)
    } catch (error) {
      handleError(error)
    }
  }

  const handleResponce = async (cred) => {
    try {
      const credJson = publicKeyCredentialToJSON(cred)

      const res = await axios({
        url: 'https://learnwebauthn-vb5r9.ondigitalocean.app/api/users/webauthn/create/response',
        method: 'POST',
        data: credJson,
        withCredentials: true,
      })

      dispatch(setIsAuth(true))
      dispatch(setUser(res.data))
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div style={{ padding: '15px' }}>
      <form
        name="registerForm"
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'column',
          width: '100%',
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          placeholder="email"
          name="email"
          InputProps={{ required: true }}
          style={{ marginBottom: '15px' }}
          type="email"
          defaultValue=""
        />

        <Button type="submit">Register</Button>
      </form>
    </div>
  )
}

export default RegisterWithWebAuthn
