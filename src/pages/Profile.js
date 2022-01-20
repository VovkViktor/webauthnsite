import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import TextField from '@mui/material/TextField'

import api from '../api'
import {
  logout,
  getEmailSelector,
  setUserKeys,
  getUserKeysSelector,
  getIsPasswordSelector,
  setUser,
} from '../redux/reducers/profile'
import {
  publicKeyCredentialToJSON,
  preformatMakeCredReq,
  createCred,
} from '../utils'
import { useErrorHandle } from '../customHook/useErrorHandle'

const Profile = () => {
  const dispatch = useDispatch()
  const userEmail = useSelector(getEmailSelector)
  const userKeys = useSelector(getUserKeysSelector)
  const isPassword = useSelector(getIsPasswordSelector)
  const handleError = useErrorHandle()

  const handleLogoutClick = async () => {
    try {
      await api.users.logout()
      dispatch(logout())
    } catch (error) {
      handleError(error)
    }
  }

  const getUserKeys = async () => {
    try {
      const { data } = await api.users.getUserKeys()
      dispatch(setUserKeys(data))
    } catch (error) {
      handleError(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const password = e.target.password.value
    try {
      const { data } = await api.users.createPassword({
        password,
      })

      dispatch(setUser(data))
    } catch (error) {
      handleError(error)
    }
  }

  const handleAddKey = async () => {
    try {
      const { data } = await api.users.createKeyWebAuthnGetCred()

      const publicKeyCredentialCreationOptions = preformatMakeCredReq(data)

      const credentials = await createCred(publicKeyCredentialCreationOptions)

      const credJson = publicKeyCredentialToJSON(credentials)

      await api.users.createKeyWebAuthnResponce(credJson)

      await getUserKeys()
    } catch (error) {
      handleError(error)
    }
  }

  const handleDeleteKey = async (e) => {
    const id = e.currentTarget.dataset.id
    try {
      await api.users.deleteUserKey(id)
      await getUserKeys()
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    getUserKeys()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container_profile">
      <p style={{ color: '#fff' }}>
        Hello <b>{userEmail}</b>! Glad to see you
      </p>
      <Button
        variant="contained"
        onClick={handleLogoutClick}
        style={{
          marginBottom: '20px',
        }}
      >
        Log Out
      </Button>
      {!isPassword && (
        <div style={{ padding: '30px', backgroundColor: '#fff' }}>
          <span style={{ color: 'darkorange', marginBottom: '15px' }}>
            You not have password! Please create password!
          </span>
          <form
            name="addPasswordForm"
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexDirection: 'column',
              width: '100%',
              marginTop: '15px',
            }}
            onSubmit={handleSubmit}
          >
            <TextField
              placeholder="password"
              name="password"
              InputProps={{ required: true }}
              style={{ marginBottom: '15px' }}
              type="password"
              defaultValue=""
            />

            <Button type="submit">Save Password</Button>
          </form>
        </div>
      )}
      <div
        className="keys_container"
        style={{
          marginTop: '50px',
          width: '90%',
          maxWidth: '400px',
          padding: '10px',
          backgroundColor: '#fff',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3>User Authn Keys</h3>
          <IconButton edge="end" aria-label="add" onClick={handleAddKey}>
            <AddCircleIcon
              style={{
                color: 'darkseagreen',
              }}
            />
          </IconButton>
        </div>

        {!userKeys.length ? (
          <span>You not have webAuthn keys</span>
        ) : (
          <List
            style={{
              backgroundColor: 'cornflowerblue',
            }}
          >
            {userKeys.map((key, index) => {
              return (
                <ListItem
                  key={key._id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={handleDeleteKey}
                      data-id={key._id}
                    >
                      <DeleteIcon
                        style={{
                          color: 'brown',
                        }}
                      />
                    </IconButton>
                  }
                >
                  <ListItemText
                    secondary={key.key.publicKey}
                    primary={`${index + 1}. Created date: ${new Date(
                      key.createdAt
                    ).toLocaleString()}`}
                    style={{ overflow: 'hidden', overflowWrap: 'break-word' }}
                  />
                </ListItem>
              )
            })}
          </List>
        )}
      </div>
    </div>
  )
}

export default Profile
