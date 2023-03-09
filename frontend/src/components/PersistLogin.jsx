import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useRefreshToken from "../hooks/useRefreshToken";
import styled from "styled-components"

export default function PersistLogin() {
  const refresh = useRefreshToken();
  const { accessToken, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;

    async function verifyUser() {
      try {
        await refresh();
        const { data } = await axiosPrivate.get("/user/me");
        setUser(data);
      } catch (error) {
        console.log(error?.response);
      } finally {
        isMounted && setLoading(false);
      }
    }

    !accessToken ? verifyUser() : setLoading(false);

    return () => {
      isMounted = false;
    };
  }, []);

  return loading ? <StyledLoader></StyledLoader> : <Outlet />;
}

const StyledLoader = styled.span`
  font-size: 10px;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  position: relative;
  top: 300px;
  left: 50%;
  display: block;
  text-indent: -9999em;
  animation: mulShdSpin 1.1s infinite ease;
  transform: translateZ(0);
  @keyframes mulShdSpin {
    0%,
    100% {
      box-shadow: 0em -2.6em 0em 0em #000000,
        1.8em -1.8em 0 0em rgba(8, 8, 8, 0.2),
        2.5em 0em 0 0em rgba(8, 8, 8, 0.2),
        1.75em 1.75em 0 0em rgba(8, 8, 8, 0.2),
        0em 2.5em 0 0em rgba(8, 8, 8, 0.2),
        -1.8em 1.8em 0 0em rgba(8, 8, 8, 0.2),
        -2.6em 0em 0 0em rgba(8, 8, 8, 0.5),
        -1.8em -1.8em 0 0em rgba(8, 8, 8, 0.7);
    }
    12.5% {
      box-shadow: 0em -2.6em 0em 0em rgba(8, 8, 8, 0.7),
        1.8em -1.8em 0 0em #000000, 2.5em 0em 0 0em rgba(8, 8, 8, 0.2),
        1.75em 1.75em 0 0em rgba(8, 8, 8, 0.2),
        0em 2.5em 0 0em rgba(8, 8, 8, 0.2),
        -1.8em 1.8em 0 0em rgba(8, 8, 8, 0.2),
        -2.6em 0em 0 0em rgba(8, 8, 8, 0.2),
        -1.8em -1.8em 0 0em rgba(8, 8, 8, 0.5);
    }
    25% {
      box-shadow: 0em -2.6em 0em 0em rgba(8, 8, 8, 0.5),
        1.8em -1.8em 0 0em rgba(8, 8, 8, 0.7), 2.5em 0em 0 0em #000000,
        1.75em 1.75em 0 0em rgba(8, 8, 8, 0.2),
        0em 2.5em 0 0em rgba(8, 8, 8, 0.2),
        -1.8em 1.8em 0 0em rgba(8, 8, 8, 0.2),
        -2.6em 0em 0 0em rgba(8, 8, 8, 0.2),
        -1.8em -1.8em 0 0em rgba(8, 8, 8, 0.2);
    }
    37.5% {
      box-shadow: 0em -2.6em 0em 0em rgba(8, 8, 8, 0.2),
        1.8em -1.8em 0 0em rgba(8, 8, 8, 0.5),
        2.5em 0em 0 0em rgba(8, 8, 8, 0.7), 1.75em 1.75em 0 0em #000000,
        0em 2.5em 0 0em rgba(8, 8, 8, 0.2),
        -1.8em 1.8em 0 0em rgba(8, 8, 8, 0.2),
        -2.6em 0em 0 0em rgba(8, 8, 8, 0.2),
        -1.8em -1.8em 0 0em rgba(8, 8, 8, 0.2);
    }
    50% {
      box-shadow: 0em -2.6em 0em 0em rgba(8, 8, 8, 0.2),
        1.8em -1.8em 0 0em rgba(8, 8, 8, 0.2),
        2.5em 0em 0 0em rgba(8, 8, 8, 0.5),
        1.75em 1.75em 0 0em rgba(8, 8, 8, 0.7), 0em 2.5em 0 0em #000000,
        -1.8em 1.8em 0 0em rgba(8, 8, 8, 0.2),
        -2.6em 0em 0 0em rgba(8, 8, 8, 0.2),
        -1.8em -1.8em 0 0em rgba(8, 8, 8, 0.2);
    }
    62.5% {
      box-shadow: 0em -2.6em 0em 0em rgba(8, 8, 8, 0.2),
        1.8em -1.8em 0 0em rgba(8, 8, 8, 0.2),
        2.5em 0em 0 0em rgba(8, 8, 8, 0.2),
        1.75em 1.75em 0 0em rgba(8, 8, 8, 0.5),
        0em 2.5em 0 0em rgba(8, 8, 8, 0.7), -1.8em 1.8em 0 0em #000000,
        -2.6em 0em 0 0em rgba(8, 8, 8, 0.2),
        -1.8em -1.8em 0 0em rgba(8, 8, 8, 0.2);
    }
    75% {
      box-shadow: 0em -2.6em 0em 0em rgba(8, 8, 8, 0.2),
        1.8em -1.8em 0 0em rgba(8, 8, 8, 0.2),
        2.5em 0em 0 0em rgba(8, 8, 8, 0.2),
        1.75em 1.75em 0 0em rgba(8, 8, 8, 0.2),
        0em 2.5em 0 0em rgba(8, 8, 8, 0.5),
        -1.8em 1.8em 0 0em rgba(8, 8, 8, 0.7), -2.6em 0em 0 0em #000000,
        -1.8em -1.8em 0 0em rgba(8, 8, 8, 0.2);
    }
    87.5% {
      box-shadow: 0em -2.6em 0em 0em rgba(8, 8, 8, 0.2),
        1.8em -1.8em 0 0em rgba(8, 8, 8, 0.2),
        2.5em 0em 0 0em rgba(8, 8, 8, 0.2),
        1.75em 1.75em 0 0em rgba(8, 8, 8, 0.2),
        0em 2.5em 0 0em rgba(8, 8, 8, 0.2),
        -1.8em 1.8em 0 0em rgba(8, 8, 8, 0.5),
        -2.6em 0em 0 0em rgba(8, 8, 8, 0.7), -1.8em -1.8em 0 0em #000000;
    }
  }
`;