import { useEffect, useState, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import styled from "styled-components";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import ShoppingLists from "../components/ShoppingLists";
import ShoppingItems from "../components/ShoppingItems";

const Home = () => {
  const { user, setUser } = useAuth();
  const [lists, setLists] = useState([]);
  const axiosPrivateInstance = useAxiosPrivate();
  const [activeList, setActiveList] = useState();

  useEffect(() => {
    async function getShoppingLists() {
      try {
        const response = await axiosPrivateInstance.get(
          "shopping_list/shopping_lists/"
        );
        if (response?.status === 200) {
          setLists(response.data);
          setActiveList(response.data[0]);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getShoppingLists();
  }, []);

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
