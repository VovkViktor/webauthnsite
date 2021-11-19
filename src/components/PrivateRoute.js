import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { getIsAuthSelector } from '../redux/reducers/profile'

const PrivateRoute = (props) => {
  const { component: Component, ...rest } = props
  const isAuth = useSelector(getIsAuthSelector)

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/auth' }} />
        )
      }
    />
  )
}

export default PrivateRoute
