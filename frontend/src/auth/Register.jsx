import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../axios";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { Link } from "react-router-dom";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{5,24}/;

const Register = () => {
  const navigate = useNavigate();
  const emailRef = useRef();

  const [userName, setUserName] = useState("");

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [password2, setPassword2] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => setValidEmail(EMAIL_REGEX.test(email)), [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
    const match = password === password2;
    setValidMatch(match);
  }, [password, password2]);

  useEffect(() => {
    setErrMsg("");
  }, [email, password, password2]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = EMAIL_REGEX.test(email);
    const v2 = PWD_REGEX.test(password);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "user/create",
        JSON.stringify({
          name: userName,
          email,
          password,
          password2,
        })
      );
      setEmail();
      setUserName();
      setPassword();
      setPassword2();
      setLoading(false);
      navigate("/auth/login");
    } catch (error) {
      if (!error?.response) {
        setErrMsg("No Server Response");
      } else if (error.response?.status === 400) {
        setErrMsg("Email already used.");
      } else {
        setErrMsg("Registration Failed.");
      }
      setLoading(false);
      //TODO: handle errors
    }
  };
  return (
    <StyledRegistration>
      <p className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <div className="field">
          <input
            type="text"
            value={userName}
            id="username"
            autoComplete="off"
            name="username"
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <div className="input-line"></div>
        </div>

        <label htmlFor="email">
          Email:
          <span className={validEmail ? "valid" : "hide"}>
            {<FontAwesomeIcon icon={faCheck} />}
          </span>
          <span className={validEmail || !email ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <div className="field">
          <input
            type="email"
            ref={emailRef}
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
          />
          <div className="input-line"></div>
        </div>
        <p
          id="uidnote"
          className={
            emailFocus && email && !validEmail ? "instructions" : "offscreen"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Must be a valid email address.
        </p>
        <label htmlFor="password">
          Password:
          <span className={validPassword ? "valid" : "hide"}>
            {<FontAwesomeIcon icon={faCheck} />}
          </span>
          <span className={validPassword || !password ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <div className="field">
          <input
            type="password"
            id="password"
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
          />
          <div className="input-line"></div>
          <p
            className={
              passwordFocus && !validPassword ? "instructions" : "offscreen"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            5 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character. <br />
            Allowed special characters: ! @ # $ %
          </p>
        </div>
        <label htmlFor="password2">
          Confirm password:
          <span className={validMatch && password2 ? "valid" : "hide"}>
            {<FontAwesomeIcon icon={faCheck} />}
          </span>
          <span className={validMatch || !password2 ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <div className="field">
          <input
            type="password"
            id="password2"
            value={password2}
            name="password2"
            onChange={(e) => setPassword2(e.target.value)}
            required
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          <div className="input-line"></div>
          <p
            className={matchFocus && !validMatch ? "instructions" : "offscreen"}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Must match the first password input field.
          </p>
        </div>

        <button
          disabled={
            !validEmail || !validPassword || !validMatch || loading
              ? true
              : false
          }
        >
          Sign Up
        </button>
      </form>
      <p className="login">
        Already registered? <br />
        <span className="line">
          <Link to="/auth/login">Sign In</Link>
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

    // sibling magic ;o
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

  .instructions {
    font-size: 0.75rem;
    border-radius: 0.5rem;
    background: #000;
    color: #fff;
    padding: 0.25rem;
    position: relative;
    bottom: -10px;
    margin-bottom: 1rem;
  }

  .instructions > svg {
    margin-right: 0.25rem;
  }

  .hide {
    display: none;
  }

  .valid {
    color: limegreen;
    margin-left: 0.25rem;
  }

  .invalid {
    color: red;
    margin-left: 0.25rem;
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

export default Register;
