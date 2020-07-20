export const strapiMessage = error => {
  if (error.response) {
    if (error.response.data.data) {
      return error.response.data.data[0] ? error.response.data.data[0].messages[0].message : 'Undefined error'
    } else {
      return error.response.data.message
    }
  } else if (error.request) {
    return error.request
  } else {
    return error.message
  }
}
