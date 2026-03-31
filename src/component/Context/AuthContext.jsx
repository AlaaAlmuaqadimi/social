import { createContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [userToken, setUserToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // وظيفة لتحديث التوكن (تستخدم عند تسجيل الدخول)
  function resetUserToken(tkn) {
    localStorage.setItem('Tkn', tkn); // نضمن حفظه في المتصفح أولاً
    setUserToken(tkn);
  }

  // وظيفة مسح التوكن (تسجيل الخروج)
  function crearUserToken() {
    localStorage.removeItem('Tkn');
    setUserToken(null);
    setUserId(null);
  }

  // التأكد من وجود توكن صالح عند تشغيل التطبيق (Initial Load)
  useEffect(() => {
    const localStorageValue = localStorage.getItem('Tkn');
    if (localStorageValue) {
      setUserToken(localStorageValue);
    }
    setIsLoading(false);
  }, []);

  // مراقبة التوكن وفك تشفيره فور تغيره
  useEffect(() => {
    if (userToken) {
      try {
        const decoded = jwtDecode(userToken);
        setUserId(decoded.id || decoded.user); // تأكدي من مسمى الحقل في API (id أو user)
      } catch (error) {
        console.error("Invalid Token Format:", error);
        crearUserToken(); // إذا كان التوكن تالفاً، امسحه فوراً لمنع الانهيار
      }
    }
  }, [userToken]);

  return (
    <AuthContext.Provider value={{ userToken, resetUserToken, crearUserToken, userId, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}