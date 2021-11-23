import { useDispatch } from 'react-redux'

import { setErrorMessage, logout } from '../redux/reducers/profile'

export const useErrorHandle = () => {
  const dispatch = useDispatch()
  const handleError = (error) => {
    if (error?.response?.data?.message) {
      dispatch(setErrorMessage(error?.response?.data?.message))
      if (error?.response?.status === 401) {
        dispatch(logout())
      }
    } else {
      if (error?.message) {
        dispatch(setErrorMessage(error?.message))
      } else {
        dispatch(setErrorMessage('something went wrong'))
      }
    }
  }

  return handleError
}
