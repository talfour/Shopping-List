import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import useFetch from "../utils/useFetch";
import styled from "styled-components";
import { motion } from "framer-motion";

import ShoppingLists from "../components/ShoppingLists";
import ShoppingItems from "../components/ShoppingItems";

const Home = () => {
  const [lists, setLists] = useState([]);
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [activeList, setActiveList] = useState();

  const api = useFetch();

  useEffect(() => {
    getShoppingLists();
  }, []);

  const getShoppingLists = async () => {
    const { response, data } = await api("/api/shopping_list/shopping_lists/");
    if (response.status === 200) {
      setLists(data);
      setActiveList(data[0]);
    }
  };

  return (
    <StyledMain>
      <ShoppingLists
        lists={lists}
        setLists={setLists}
        activeList={activeList}
        setActiveList={setActiveList}
      />
      <ShoppingItems
        lists={lists}
        setLists={setLists}
        activeList={activeList}
        setActiveList={setActiveList}
      />
    </StyledMain>
  );
};

const StyledMain = styled(motion.div)`
  display: flex;
  justify-content: space-around;
  padding: 5rem 20rem;
  min-height: 80vh;
  gap: 2rem;
`;

export default Home;
