import { Routes, Route } from "react-router-dom";
import {
  Signup, Login, ForgotPassword, Profile, ActivateAccount,
  VerifyEmail, ConfirmResetPassword, ChangePassword
} from '../components/Index.jsx';

import Modal from "./Modal";
import PrivateRoutes from "./PrivateRoutes";
import useAutoLogout from "./useAutoLogout";

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
    </>
  );
}

export default AppRoutes;
