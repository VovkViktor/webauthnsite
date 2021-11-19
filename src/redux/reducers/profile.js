import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  email: '',
  isLoading: false,
  isAuth: false,
  userKeys: [],
  errorMessage: '',
  isPassword: false,
}

export const getIsLoadingSelector = (state) => state.profile.isLoading
export const getIsAuthSelector = (state) => state.profile.isAuth
export const getErrorMessage = (state) => state.profile.errorMessage
export const getEmailSelector = (state) => state.profile.email
export const getUserKeysSelector = (state) => state.profile.userKeys
export const getIsPasswordSelector = (state) => state.profile.isPassword

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email
      state.errorMessage = ''
      state.isPassword = action.payload.isPassword
    },
    setIsLoading(state, actions) {
      state.isLoading = actions.payload
    },
    setIsAuth(state, actions) {
      state.isAuth = actions.payload
    },
    setErrorMessage(state, actions) {
      state.errorMessage = actions.payload
    },
    setUserKeys(state, actions) {
      state.userKeys = actions.payload
    },
    logout(state) {
      state.isAuth = initialState.isAuth
      state.email = initialState.email
      state.errorMessage = initialState.errorMessage
      state.userKeys = initialState.userKeys
      state.isPassword = initialState.isPassword
    },
  },
})

export const {
  setUser,
  setIsLoading,
  setIsAuth,
  setErrorMessage,
  logout,
  setUserKeys,
} = profileSlice.actions

export default profileSlice.reducer
