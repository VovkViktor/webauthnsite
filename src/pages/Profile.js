import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import TextField from '@mui/material/TextField'
import {
  logout,
  getEmailSelector,
  setUserKeys,
  getUserKeysSelector,
  getIsPasswordSelector,
  setUser,
} from '../redux/reducers/profile'
import axios from 'axios'
import {
  handleError,
  publicKeyCredentialToJSON,
  preformatMakeCredReq,
  createCred,
} from '../utils'

const Profile = () => {
  const dispatch = useDispatch()
  const userEmail = useSelector(getEmailSelector)
  const userKeys = useSelector(getUserKeysSelector)
  const isPassword = useSelector(getIsPasswordSelector)

  const handleLogoutClick = async () => {
    try {
      await axios({
        method: 'GET',
        url: 'https://learnwebauthn-vb5r9.ondigitalocean.app/api/users/logout',
        withCredentials: true,
      })
      dispatch(logout())
    } catch (error) {
      handleError(error, dispatch)
    }
  }

  const getUserKeys = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: 'https://learnwebauthn-vb5r9.ondigitalocean.app/api/users/authn-keys',
        withCredentials: true,
      })
      dispatch(setUserKeys(data))
    } catch (error) {
      handleError(error, dispatch)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newPass = e.target.password.value
    try {
      const { data } = await axios({
        method: 'POST',
        url: 'https://learnwebauthn-vb5r9.ondigitalocean.app/api/users/add-password',
        withCredentials: true,
        data: {
          password: newPass,
        },
      })

      dispatch(setUser(data))
    } catch (error) {
      handleError(error, dispatch)
    }
  }

  const handleAddKey = async () => {
    try {
      const { data } = await axios({
        url: 'https://learnwebauthn-vb5r9.ondigitalocean.app/api/users/webauthn/create/key',
        method: 'GET',
        withCredentials: true,
      })

      const publicKeyCredentialCreationOptions = preformatMakeCredReq(data)

      const credentials = await createCred(publicKeyCredentialCreationOptions)

      const credJson = publicKeyCredentialToJSON(credentials)

      await axios({
        url: 'https://learnwebauthn-vb5r9.ondigitalocean.app/api/users/webauthn/create/key/response',
        method: 'POST',
        data: credJson,
        withCredentials: true,
      })

      getUserKeys()
    } catch (error) {
      handleError(error, dispatch)
    }
  }

  const handleDeleteKey = async (e) => {
    const _id = e.currentTarget.dataset.id
    try {
      await axios({
        method: 'DELETE',
        url: `https://learnwebauthn-vb5r9.ondigitalocean.app/api/users/authn-key/delete/${_id}`,
        withCredentials: true,
      })
      getUserKeys()
    } catch (error) {
      handleError(error, dispatch)
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

            <Button type="submit">Safe Password</Button>
          </form>
        </div>
      )}
      <div
        className="keys_container"
        style={{
          marginTop: '50px',
          width: '50%',
          padding: '30px',
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
            {userKeys.map((key) => {
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
                    primary={key.key.publicKey}
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
