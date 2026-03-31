import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export default function ProtectedRoute({ children, isAuth }) {
  // الاعتماد على حالة التوكن من الكونتكست لضمان المزامنة
  const { userToken } = useContext(AuthContext);
  
  // نتحقق من localStorage كخيار احتياطي سريع
  const token = userToken || localStorage.getItem("Tkn");

  if (isAuth) {
    // لو المستخدم يحاول دخول Login/Register وهو مسجل دخول فعلاً
    if (token) {
      return <Navigate to="/" />;
    }
    return children;
  } else {
    // لو يحاول دخول صفحة محمية (Home/Profile) وهو ليس مسجل دخول
    if (!token) {
      return <Navigate to="/login" />;
    }
    return children;
  }
}