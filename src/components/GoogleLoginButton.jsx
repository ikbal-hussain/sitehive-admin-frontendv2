import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../api/auth";
import { setToken } from "../utils/auth";
import { toast } from "react-toastify";

export default function GoogleLoginButton({ onSuccess }) {
  const handleSuccess = async (response) => {
    try {
      const res = await googleLogin(response.credential);
      setToken(res.data.token);
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("Google Login Failed");
    }
  };

  return <GoogleLogin onSuccess={handleSuccess} onError={() => toast("Google Login Failed")} />;
}