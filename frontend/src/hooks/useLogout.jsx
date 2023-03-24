import { axiosPrivateInstance } from "../axios";
import useAuth from "./useAuth";

export default function useLogout() {
  const { setUser, setAccessToken, setCSRFToken, setIsLoggedIn } = useAuth();

  const logout = async () => {
    try {
      const response = await axiosPrivateInstance.post("user/logout");
      setAccessToken(null);
      setCSRFToken(null);
      setUser({});
      setIsLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };
  return logout;
}
