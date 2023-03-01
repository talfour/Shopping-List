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
      <h1>Navbar</h1>
      <div>
        {user ? (
          <p onClick={logoutUser}>Logout</p>
        ) : (
          <Link to="/login">Login</Link>
        )}

        <Link to="/">Home</Link>
      </div>
    </NavStyled>
  );
};

const NavStyled = styled(motion.nav)`
  width: 100%;
  background: black;
  color: white;
`;

export default Nav;
