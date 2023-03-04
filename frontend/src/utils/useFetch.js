import { useContext } from "react";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import AuthContext from "../context/AuthContext";

const useFetch = () => {
  const config = {};

  let { authTokens, setAuthTokens, setUser } = useContext(AuthContext);

  const baseURL = "http://127.0.0.1:8000";

  const originalRequest = async (url, config) => {
    url = `${baseURL}${url}`;
    const response = await fetch(url, config);
    const data = await response.json();
    return { response, data };
  };

  const refreshToken = async (authTokens) => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/user/token/refresh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      }
    );
    const data = await response.json();
    localStorage.setItem("authTokens", JSON.stringify(data));
    setAuthTokens(data);
    setUser(jwt_decode(data.access));
    return data;
  };

  const callFetch = async (url, method, body) => {
    const user = jwt_decode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (isExpired) {
      authTokens = await refreshToken(authTokens);
    }
    config["method"] = method;
    if (body !== "") {
      config["body"] = JSON.stringify(body);
    }

    config["headers"] = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authTokens?.access}`,
    };

    const { response, data } = await originalRequest(url, config);
    return { response, data };
  };

  return callFetch;
};

export default useFetch;
