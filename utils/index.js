import jwt from 'jsonwebtoken'
// import { openBox } from '../utils/nacl'

export const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
}

const cookieDel = { maxAge: 1, httpOnly: true }
// Cookie: token <access_token>
// Authorization: Bearer <access_token>
export const verifyToken = (req, res, next) => {
  const bearerCookie = req.cookies.token
  let bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    bearerHeader = bearerHeader.split(' ')[1]
  }
  const jwtToken = bearerCookie || bearerHeader
  if (typeof jwtToken !== 'undefined') {
    // const bearerToken = token.split(' ')[1]
    // req.token = bearerToken;
    const appOrigin = req.get('origin')
    jwt.verify(jwtToken, process.env.NACL_SECRET, (err, tokenData) => {
      if (err) {
        res.cookie('token', 'kek', cookieDel)
        res.cookie('cp002', false)
        console.log('utils 1')
        res.status(423).json({
          code: '423',
          message: 'Token error: ' + err.name
        })
      } else {
        // let boxMsg = openBox(tokenData.d, process.env.NACL_NONCE, process.env.NACL_SECRET)
        // tokenData.keys = {
        //   key: boxMsg.split(' ')[0],
        //   nonce: boxMsg.split(' ')[1]
        // }
        if (appOrigin !== tokenData.aud) {
          res.cookie('token', 'kek', cookieDel)
          res.cookie('cp002', false)
          console.log('utils 2')
          res.status(423).json({
            code: '423',
            message: 'Token error'
          })
        }
        req.tokenData = tokenData
        next()
      }
    })
  } else {
    res.cookie('token', 'kek', cookieDel)
    res.cookie('cp002', false)
    console.log('utils 3')
    res.status(423).json({
      code: '423',
      message: 'Forbidden'
    })
  }
}
