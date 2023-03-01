import axios from "axios";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

//Define the Login function.


const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const {loginUser} = useContext(AuthContext)

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={loginUser}>
        <input
          type="email"
          placeholder="email"
          value={username}
          name="email"
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
