import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const ShoppingLists = ({ lists, setLists, setActiveList }) => {
  const axiosPrivateInstance = useAxiosPrivate();
  const [isNewVisible, setIsNewVisible] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");


  const shoppingListHandler = (e) => {
    const listID = e.target.dataset.tag;
    const list = lists.filter((l) => l.id == listID);
    setActiveList(list[0]);
  };

  const addNewListHandler = async (e) => {
    e.preventDefault();
    const response = await axiosPrivateInstance.post(
      "shopping_list/shopping_lists/",
      { title: title, description: description }
    );

    if (response?.status === 201) {
      setLists((prevState) => [response.data, ...prevState]);
      setActiveList(response.data);
      setIsNewVisible(false);
      setTitle("");
      setDescription("");
    }
  };

  const addNewListDialogHandler = () => {
    setIsNewVisible(true);
  };

  const exitNewListHandler = (e) => {
    const element = e.target;
    if (element.classList.contains("shadow")) {
      setIsNewVisible(false);
    }
  };

  return (
    <StyledShoppingList className={setShowList ? "showListActive": "showListDisabled"}>
      <StyledNewList
        onClick={exitNewListHandler}
        className={isNewVisible ? "newListActive shadow" : "newListDisabled"}
      >
        <Detail>
          <form onSubmit={addNewListHandler} action="POST">
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="Please enter new list..."
            />
            <input
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              type="text"
              placeholder="Description"
            />
            <button type="submit">Submit</button>
          </form>
        </Detail>
      </StyledNewList>
      <div className="splitter">
        <h2>Lists</h2>
        <span onClick={addNewListDialogHandler}>+</span>
      </div>

      {lists.map((list) => (
        <StyledListItem
          key={list.id}
          onClick={shoppingListHandler}
          data-tag={list.id}
        >
          <h3>{list.title}</h3>
          {list.items.length ? <span>{list.items.length}</span> : ""}
        </StyledListItem>
      ))}
    </StyledShoppingList>
  );
};

const StyledShoppingList = styled.div`
  flex: 0 0 20vw;
  h2 {
    color: #37474f;
    padding: 0 0 2rem 0;
  }
  .splitter {
    display: flex;
    justify-content: space-between;
    font-weight: lighter;
    font-size: 2rem;
    color: #37474f;
    padding: 0 0 2rem 0;
    transition: all 0.5s ease;
    span {
      cursor: pointer;
      :hover {
        color: #263136;
      }
    }
  }
  @media (max-width: 930px) {
    display: none;
  }
`;

const StyledListItem = styled.div`
  padding: 1rem 0.2rem;
  display: flex;
  justify-content: space-between;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.5s ease;
  background-color: #f4f4f4;
  border-bottom: rgba(0, 0, 0, 0.5) 1px solid;
  span {
    background-color: #bf616a;
    border-radius: 2px;
    padding: 0 1rem;
  }
  :hover {
    background-color: #d3d3d3;
  }
`;

const StyledNewList = styled(motion.div)`
  width: 100%;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  transition: all 0.75s ease;
`;

const Detail = styled(motion.div)`
  min-height: 50vh;
  width: 50%;
  border-radius: 1rem;
  padding: 2rem 5rem;
  background: white;
  position: absolute;
  top: 25%;
  left: 25%;
  color: black;
  z-index: 10;
  text-align: center;
  display: flex;
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    input {
      border-radius: 5px;
      background-color: #e2e2e2;
      border: none;
      padding: 1rem 1rem;
      font-size: 1.2rem;
      margin-bottom: 1rem;
      width: 100%;
      text-align: center;
    }
    button {
      background-color: #37474f;
    }
  }
`;
export default ShoppingLists;
