import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { useModal } from "../context/ModalContext"
function RequireAuth() {
  const {openModal} = useModal();
  const auth = useAuth()
  const location = useLocation()
  if (!auth.user) {
    openModal('You must Login in or create a new account to continue')}
  return (
    auth?.user
    ? <Outlet />
    : <Navigate to="/login" state={{from : location}} replace />
  )
}

export default RequireAuth