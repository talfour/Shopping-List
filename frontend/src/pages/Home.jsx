import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import styled from "styled-components";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import ShoppingLists from "../components/ShoppingLists";
import ShoppingItems from "../components/ShoppingItems";
import sortFoodItemsByTypeAndName from "../Utils";

const Home = () => {
  const { user, setUser, setIsLoggedIn } = useAuth();
  const [lists, setLists] = useState([]);
  const axiosPrivateInstance = useAxiosPrivate();
  const [activeList, setActiveList] = useState();
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    async function getShoppingLists() {
      try {
        const response = await axiosPrivateInstance.get(
          "shopping_list/shopping_lists/"
        );
        if (response?.status === 200) {
          const sortedLists = response.data.map((list) => {
            const sortedItems = sortFoodItemsByTypeAndName(list.items);
            return { ...list, items: sortedItems };
          });
          setLists(sortedLists);
          setActiveList(response.data[0]);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getShoppingLists();
    setIsLoggedIn(true);
  }, []);

  return (
    <StyledMain>
      <ShoppingLists
        lists={lists}
        setLists={setLists}
        activeList={activeList}
        setActiveList={setActiveList}
        showList={showList}
        setShowList={setShowList}
      />
      <ShoppingItems
        lists={lists}
        setLists={setLists}
        activeList={activeList}
        setActiveList={setActiveList}
        showList={showList}
        setShowList={setShowList}
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
  @media (max-width: 930px) {
    padding: 2rem 1rem;
    flex-wrap: wrap;
    gap: 0;
  }
`;

export default Home;
