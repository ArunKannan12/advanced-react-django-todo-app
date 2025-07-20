import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ActivateAccount = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
  const activateUser = async () => {
    try {
  
      const response = await axios.post("auth/users/activation/", {
        uid,
        token,
      });

      if (response.status === 204) {
       
        toast.success("Account activated successfully!");
        navigate("/");  // 🔁 Redirect to login
      } else {
       
        toast.error("Unexpected server response.");
        navigate("/signup");
      }
    } catch (error) {
      console.error("❌ Activation failed:", error);
      if (error.response) {
        console.error("📄 Server error:", error.response.data);
      }
      toast.error("Activation failed. Please try again.");
      navigate("/");
    }
  };

  activateUser();
}, [uid, token, navigate]);


  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 px-3 text-center">
      <span className="fs-5">Activating your account...</span>
    </div>

  );
};

export default ActivateAccount;
