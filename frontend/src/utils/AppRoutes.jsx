import { Routes, Route } from "react-router-dom";
import { lazy,Suspense } from "react";
import Modal from "./Modal";
import PrivateRoutes from "./PrivateRoutes";
import useAutoLogout from "./useAutoLogout";
import { Spinner } from "./Spinner";

const Signup = lazy(() => import('../components/Signup'));
const Login = lazy(() => import('../components/Login'))
const ForgotPassword = lazy(() => import('../components/ForgotPassword'));
const Profile = lazy(() => import('../components/Profile'));
const ActivateAccount = lazy(() => import('../components/ActivateAccount'));
const VerifyEmail = lazy(() => import('../components/VerifyEmail'));
const ConfirmResetPassword = lazy(() => import('../components/ConfirmResetPassword'));
const ChangePassword = lazy(() => import('../components/ChangePassword'));


function AppRoutes() {
  const { modalOpen, onConfirm, onClose } = useAutoLogout();

  return (
    <>
      <Modal
        isOpen={modalOpen}
        title="Session Expiring"
        message="You will be logged out soon due to inactivity. Do you want to stay logged in?"
        onConfirm={onConfirm}
        onClose={onClose}
      />
      <Suspense fallback={<Spinner showAlways/>}>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/activation/:uid/:token" element={<ActivateAccount />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password-confirm/:uid/:token" element={<ConfirmResetPassword />} />

          <Route path="/change-password" element={
            <PrivateRoutes>
              <ChangePassword />
            </PrivateRoutes>
          } />

          <Route path="/profile" element={
            <PrivateRoutes>
              <Profile />
            </PrivateRoutes>
          } />
        </Routes>

      </Suspense>
    </>
  );
}

export default AppRoutes;
