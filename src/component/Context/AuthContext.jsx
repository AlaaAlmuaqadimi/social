
import { createContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
export const AuthContext = createContext();
export default function AuthContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const [userToken, setUserToken] = useState(null)
  const [userId, setUserId] = useState(null)
  // console.log('userToken', userToken)

  function resetUserToken(tkn) {
    setUserToken(tkn)
  }
  function crearUserToken() {

    setUserToken(null)

  }

  const localStorageValue = localStorage.getItem('Tkn')

  useEffect(function () {
    if (localStorageValue !== null) {
      setUserToken(localStorageValue)
    }

    setIsLoading(false)
  }, []);

  function deCodeToken() {
    const deCodeToken = jwtDecode(userToken)
    userId(decoded.user)
  }
  useEffect(() => {
    if (userToken) {
      const decoded = jwtDecode(userToken);
      // console.log('decodedToken', decoded.user);
    
      setUserId(decoded.user);
    }
  }, [userToken]);

  return (
    <>
      <AuthContext.Provider value={{ userToken, resetUserToken, crearUserToken, userId }}>
        {children}
      </AuthContext.Provider>
    </>
  )
}
