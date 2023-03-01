import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Nav = () => {
  const [isAuth, setIsAuth] = useState(false);
  let { user, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    if (localStorage.getItem("access_token") !== null) {
      setIsAuth(true);
    }
  }, []);

  return (
    <nav>
      <h1>Navbar</h1>
      <div>
        {user ? <p onClick={logoutUser}>Logout</p> : <Link to="/login">Login</Link>}

        <Link to="/">Home</Link>
      </div>
    </nav>
  );
};

export default Nav;
