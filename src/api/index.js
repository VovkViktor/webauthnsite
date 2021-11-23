import axios from 'axios'

class UserCRUD {
  constructor(config) {
    const { request, url } = config
    this.url = url
    this.request = request
  }

  whoAmI() {
    return this.request({
      url: `${this.url}/howami`,
    })
  }

  register(data) {
    return this.request({
      url: `${this.url}/register`,
      method: 'POST',
      data,
    })
  }

  login(data) {
    return this.request({
      url: `${this.url}/login`,
      method: 'POST',
      data,
    })
  }

  logout() {
    return this.request({
      url: `${this.url}/logout`,
    })
  }

  createPassword(data) {
    return this.request({
      url: `${this.url}/add-password`,
      method: 'POST',
      data,
    })
  }

  getUserKeys() {
    return this.request({
      url: `${this.url}/authn-keys`,
    })
  }

  loginWebAuthnGetCred(data) {
    return this.request({
      url: `${this.url}/webauthn/login`,
      method: 'POST',
      data,
    })
  }

  loginWebAuthnResponce(data) {
    return this.request({
      url: `${this.url}/webauthn/login/response`,
      method: 'POST',
      data,
    })
  }

  registerWebAuthnGetCred(data) {
    return this.request({
      url: `${this.url}/webauthn/create`,
      method: 'POST',
      data,
    })
  }

  registerWebAuthnResponce(data) {
    return this.request({
      url: `${this.url}/webauthn/create/response`,
      method: 'POST',
      data,
    })
  }

  createKeyWebAuthnGetCred() {
    return this.request({
      url: `${this.url}/webauthn/create/key`,
    })
  }

  createKeyWebAuthnResponce(data) {
    return this.request({
      url: `${this.url}/webauthn/create/key/response`,
      method: 'POST',
      data,
    })
  }

  deleteUserKey(id) {
    return this.request({
      url: `${this.url}/authn-key/delete/${id}`,
      method: 'DELETE',
    })
  }
}

const userCrud = (request) => {
  return new UserCRUD({
    url: '/users',
    request,
  })
}

class ClientApi {
  static instatce
  constructor() {
    ClientApi.instatce = axios.create({
      baseURL: 'https://learnwebauthn-vb5r9.ondigitalocean.app/api',
      timeout: 10000,
      withCredentials: true,
    })

    this.users = userCrud(ClientApi.instatce)
  }
}

const api = new ClientApi()

export default api
