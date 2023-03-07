import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import styled from "styled-components";
import { motion } from "framer-motion";
import useLogout from "../hooks/useLogout";

const Nav = () => {
  const { user } = useAuth();
  const logout = useLogout();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    navigate("/auth/login");
  };

  return (
    <NavStyled>
      <Link to="/">
        <h1>Shopping List</h1>
      </Link>
      {user ? (
        <div>
          <Link to="auth/user">{user?.name}</Link>
          <button disabled={loading} type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <Link to="/auth/login">Login</Link>
          <Link to="/auth/register">Register</Link>
        </div>
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
    color: #bdbdbd;
    transition: all 0.7s ease;
    font-weight: bold;
    :hover {
      color: white;
    }
  }
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    button {
      padding: 0 2rem;
      color: #bdbdbd;
      font-size: 1.1rem;
      cursor: pointer;
      border: 0;
      :hover {
        background: none;
        color: white;
      }
    }
  }
`;

export default Nav;
