import { useState, createContext } from "react";

export const AuthContext = createContext({
  user: {},
  setUser: () => {},
  accessToken: null,
  refreshToken: null,
  csrftoken: null,
  isLoggedIn: null,
  setAccessToken: () => {},
  setRefreshToken: () => {},
  setCSRFToken: () => {},
  setIsLoggedIn: () => {},
});

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [csrftoken, setCSRFToken] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState();

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        csrftoken,
        setCSRFToken,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
