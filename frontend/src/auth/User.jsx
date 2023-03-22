import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useLogout from "../hooks/useLogout";
import styled from "styled-components";

export default function User() {
  const { user, setUser } = useAuth();
  const axiosPrivateInstance = useAxiosPrivate();
  const navigate = useNavigate();
  const logout = useLogout();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);

    await logout();
    navigate("/auth/login");
  }

  useEffect(() => {
    async function getUser() {
      const { data } = await axiosPrivateInstance.get("user/me");
      setUser(data);
    }

    getUser();
  }, []);

  return (
    <StyledUserInfo>
      <h3>User name: {user?.name}</h3>
      <h3>User email: {user?.email}</h3>
    </StyledUserInfo>
  );
}

const StyledUserInfo = styled.div`
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h3{
    padding: 1rem 0rem;
  }
`;
