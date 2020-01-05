import jwtDecode from 'jwt-decode'
import cookieparser from 'cookieparser'

export function getUserFromCookie (req) {
  if ((process.server && process.static) || !req.headers.cookie) {
    return
  }
  const parsed = cookieparser.parse(req.headers.cookie)
  const accessTokenCookie = parsed.access_token
  if (!accessTokenCookie) {
    return
  }
  const decodeToken = jwtDecode(accessTokenCookie)
  if (!decodeToken) {
    return
  }
  return decodeToken
}
