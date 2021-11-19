import { configureStore } from '@reduxjs/toolkit'

import profile from '../reducers/profile'



const store = configureStore({
  reducer: {
    profile,
  },
  devTools: process.env.REACT_APP_CUSTOM_NODE_ENV !== 'production',
})



export { store }