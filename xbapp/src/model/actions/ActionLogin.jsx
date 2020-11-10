import { LOG_IN } from '../actionTypes'

export const ActionLogin = (email, password) => ({
  type: LOG_IN,
  payload: {
    email: email,
    password: password
  }
})
