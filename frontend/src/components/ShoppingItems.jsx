import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import useFetch from "../utils/useFetch";
const ShoppingItems = ({ activeList, setActiveList, setLists, lists }) => {
  const api = useFetch();

  const removeListHandler = async () => {
    const { response } = await api(
      `/api/shopping_list/shopping_lists/${activeList.id}`,
      "DELETE", ""
    );
    console.log(response);
    // if (response.status === 404) {
    //       console.log(response.status);
    //       // setLists((prevData) =>
    //       //   prevData.filter((data) => data.id != activeList.id)
    //       // );
    // }

    // setActiveList(lists[0])
  };

  return (
    <StyledShoppingWrapper>
      <div className="top-section">
        <h2>{activeList && activeList.title}</h2>
        <span onClick={removeListHandler}>Delete list</span>
      </div>

      <StyledShoppingItems>
        <input placeholder="What would you like to buy?" type="text"></input>
        {activeList &&
          activeList.items.map((item) => (
            <StyledItem key={item.id}>{item.name}</StyledItem>
          ))}
      </StyledShoppingItems>
    </StyledShoppingWrapper>
  );
};

const StyledShoppingWrapper = styled.div`
  width: 100%;
  .top-section {
    display: flex;
    justify-content: space-around;
    background: #78909e;
    color: white;
    align-items: center;
    margin-bottom: 1rem;
    box-shadow: 0px 10px 5px 0px rgba(0, 0, 0, 0.75);
    min-height: 8vh;
    span {
      background-color: #bf616a;
      padding: 1rem 1rem;
      border-radius: 5px;
      cursor: pointer;
    }
  }
`;

const StyledShoppingItems = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 3rem auto;
  grid-gap: 5px;
  justify-items: center;
  text-align: center;
  background: #37474f;
  box-shadow: 0px 10px 5px 0px rgba(0, 0, 0, 0.75);
  min-height: 50vh;
  padding: 1rem 1rem;
  input {
    border: none;
    width: 95%;
    grid-column: 1/-1;
    height: 2rem;
    background: #253036;
    color: white;
    font-size: 1.5rem;
    padding: 0rem 1rem;
    margin: 0 2rem;
    border-radius: 5px;
  }
`;

const StyledItem = styled(motion.div)`
  height: 5rem;
  cursor: pointer;
  width: 5rem;
  background-color: #a3b38c;
  border-radius: 5px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default ShoppingItems;
