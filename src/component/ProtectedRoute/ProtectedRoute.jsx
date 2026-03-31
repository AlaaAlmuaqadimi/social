import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children, isAuth }) {
  const token = localStorage.getItem("Tkn")

  if (isAuth) {

    if (token) {
      return <Navigate to="/" />
    } else {
      return children
    }
  } else {

    if (!isAuth) {
      if (!token) {
        return <Navigate to="/login" />
      } else {
        return children
      }
    }

    return children
  }
}