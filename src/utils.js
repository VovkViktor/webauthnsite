import base64url from 'base64url'

export const publicKeyCredentialToJSON = (pubKeyCred) => {
  if (pubKeyCred instanceof Array) {
    let arr = []
    for (let i of pubKeyCred) {
      arr.push(publicKeyCredentialToJSON(i))
    }
    return arr
  }

  if (pubKeyCred instanceof ArrayBuffer) {
    return base64url.encode(pubKeyCred)
  }

  if (pubKeyCred instanceof Object) {
    let obj = {}

    for (let key in pubKeyCred) {
      obj[key] = publicKeyCredentialToJSON(pubKeyCred[key])
    }

    return obj
  }

  return pubKeyCred
}



export const preformatMakeCredReq = (makeCredReq) => {
  makeCredReq.challenge = base64url.toBuffer(makeCredReq.challenge)
  makeCredReq.user.id = base64url.toBuffer(makeCredReq.user.id)

  return makeCredReq
}



export const preformatGetAssertReq = (getAssert) => {
  getAssert.challenge = base64url.toBuffer(getAssert.challenge)

  for (let allowCred of getAssert.allowCredentials) {
    allowCred.id = base64url.toBuffer(allowCred.id)
  }

  return getAssert
}

export const createCred = async (publicKey) => {
  return await navigator.credentials.create({
    publicKey,
  })
}

// export const generateRandomBuffer = (len) => {
//   len = len || 32

//   let randomBuffer = new Uint8Array(len)
//   window.crypto.getRandomValues(randomBuffer)

//   return randomBuffer
// }
