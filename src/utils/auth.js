import Cookies from 'js-cookie'

const TokenKey = 'business-Token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (agentToken) {
  return Cookies.set(TokenKey, agentToken)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
