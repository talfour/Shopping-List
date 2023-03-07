import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { axiosInstance } from "../axios";
import styled from "styled-components";

const Login = () => {
  const { setAccessToken, setCSRFToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || "/";
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const emailRef = useRef();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "user/login",
        JSON.stringify({
          email,
          password,
        })
      );

      setAccessToken(response?.data?.access_token);
      setCSRFToken(response.headers["x-csrftoken"]);
      setEmail("");
      setPassword("");
      setLoading(false);

      navigate(fromLocation, { replace: true });
    } catch (error) {
      if (!error?.response) {
        setErrMsg("No Server Response");
      } else if (error.response?.status === 400) {
        setErrMsg("Missing Email or Password");
      } else if (error.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed.");
      }
      setLoading(false);
    }
  };

  return (
    <StyledRegistration>
      <p className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <div className="field">
          <input
            type="email"
            value={email}
            name="email"
            ref={emailRef}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="input-line"></div>
        </div>
        <label htmlFor="password">Password:</label>
        <div className="field">
          <input
            type="password"
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="input-line"></div>
        </div>
        <button disabled={loading}>Login</button>
      </form>
      <p className="login">
        Need an Account? <br />
        <span className="line">
          <Link to="auth/register">Sign Up</Link>
        </span>
      </p>
    </StyledRegistration>
  );
};

const StyledRegistration = styled.section`
  width: 100%;
  max-width: 420px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 1rem;
  background-color: rgba(55, 71, 79, 0.8);
  margin: 10rem auto;
  border-radius: 5px;
  box-shadow: 0px 10px 5px 0px rgba(0, 0, 0, 0.75);
  color: #ebebeb;
  h1 {
    text-align: center;
  }
  form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    flex-grow: 1;
    padding-bottom: 1rem;
    color: #d8d8d8;
  }
  a,
  a:visited {
    color: #fff;
  }
  input[type="text"],
  input[type="password"],
  button,
  textarea {
    font-size: 22px;
    padding: 0.25rem;
    border-radius: 0.5rem;
  }

  input[type="text"],
  input[type="email"],
  input[type="password"],
  button,
  textarea {
    font-size: 22px;
    padding: 0.25rem;
    border-radius: 0.5rem;
  }

  label,
  button {
    margin-top: 1rem;
  }
  input {
    color: #fff;
    background: 0;
    border: 0;
    outline: none;
    width: 80vw;
    max-width: 400px;
    font-size: 1.5em;
    transition: padding 0.3s 0.2s ease;

    &:focus {
      padding-bottom: 5px;
    }

    &:focus + .input-line {
      &:after {
        transform: scaleX(1);
      }
    }
  }

  .field {
    position: relative;
  }
  .input-line {
    width: 100%;
    height: 3px;
    position: absolute;
    bottom: -8px;
    background: #767676;

    &:after {
      content: " ";
      position: absolute;
      float: right;
      width: 100%;
      height: 3px;
      transform: scalex(0);
      transition: transform 0.3s ease;
      background: #fff;
    }
  }

  button {
    padding: 0.5rem;
    margin-top: 2rem;
  }

  .errmsg {
    background-color: lightpink;
    color: firebrick;
    font-weight: bold;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .line {
    display: inline-block;
    a {
      transition: all 0.7s ease;
    }
    a:hover {
      color: limegreen;
    }
  }
  .login {
    text-align: center;
  }
`;

export default Login;
