import Nav from "./components/Nav";
import Home from "./pages/Home";
import Login from "./auth/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import GlobalStyle from "./components/GlobalStyle";
import Register from "./auth/Register";
import AuthMiddleware from "./middleware/AuthMiddleware";
import User from "./auth/User";
import PersistLogin from "./components/PersistLogin";

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <Nav />

      <Routes>
        <Route path="/" element={<PersistLogin />}>
          <Route path="" element={<AuthMiddleware />}>
            <Route index exact element={<Home />} />
          </Route>
          <Route path="/auth">
            <Route path="login" element={<Login />}></Route>
            <Route path="register" element={<Register />}></Route>
            <Route path="user" element={<AuthMiddleware />}>
              <Route index element={<User />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />}></Route>
      </Routes>
    </div>
  );
}

export default App;
