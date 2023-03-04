import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

import styled from "styled-components";
import { motion } from "framer-motion";

const Nav = () => {
  const [isAuth, setIsAuth] = useState(false);
  let { user, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    if (localStorage.getItem("access_token") !== null) {
      setIsAuth(true);
    }
  }, []);

  return (
    <NavStyled>
      <Link to="/">
        <h1>Shopping List</h1>
      </Link>
      {user ? (
        <button onClick={logoutUser}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </NavStyled>
  );
};

const NavStyled = styled(motion.nav)`
  min-height: 10vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #37474f;
  color: white;
  box-shadow: 0px 10px 5px 0px rgba(0, 0, 0, 0.75);
  a {
    color: white;
  }
`;

export default Nav;
