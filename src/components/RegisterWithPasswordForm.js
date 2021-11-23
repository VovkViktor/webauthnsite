import React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setIsAuth, setUser } from '../redux/reducers/profile'
import { useErrorHandle } from '../customHook/useErrorHandle'

const RegisterWithPasswordForm = () => {
  const dispatch = useDispatch()
  const handleError = useErrorHandle()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const _email = e.target.email.value
    const _password = e.target.password.value
    try {
      const result = await axios({
        url: 'https://learnwebauthn-vb5r9.ondigitalocean.app/api/users/register',
        method: 'POST',
        data: {
          email: _email,
          password: _password,
        },
      })
      dispatch(setIsAuth(true))
      dispatch(setUser(result.data))
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
        //method=""
      >
        <TextField
          placeholder="email"
          name="email"
          InputProps={{ required: true }}
          style={{ marginBottom: '15px' }}
          type="email"
          //defaultValue="viktor.vovk@vilmate.com"
        />
        <TextField
          placeholder="password"
          name="password"
          InputProps={{ required: true }}
          style={{ marginBottom: '15px' }}
          type="password"
          //defaultValue="dallas"
        />
        <Button type="submit">Register</Button>
      </form>
    </div>
  )
}

export default RegisterWithPasswordForm
