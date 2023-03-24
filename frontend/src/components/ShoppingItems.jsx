import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUserPlus, faX } from "@fortawesome/free-solid-svg-icons";
import ShoppingItem from "./ShoppingItem";
import sortFoodItemsByTypeAndName from "../Utils";

const ShoppingItems = ({ activeList, setActiveList, setLists, lists, showList, setShowList }) => {
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [previousUsedItems, setPreviousUsedItems] = useState();
  const [newUser, setNewUser] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [searched, setSearched] = useState("");
  const [searchResult, setSearchResult] = useState([]);


  const axiosPrivateInstance = useAxiosPrivate();

  const removeListHandler = async () => {
    const response = await axiosPrivateInstance.delete(
      `/shopping_list/shopping_lists/${activeList.id}`
    );
    if (response.status === 204) {
      const filteredList = lists.filter((e) => {
        return e.id !== activeList.id;
      });
      setLists(filteredList);
      setActiveList(filteredList[0]);
    }
  };

  const addNewListDialogHandler = () => {
    setAddUserDialog(true);
  };

  const exitNewListHandler = (e) => {
    const element = e.target;
    if (element.classList.contains("shadow")) {
      setAddUserDialog(false);
      setErrMsg("");
      setSuccessMsg("");
      setNewUser("");
    }
  };

  const addNewUserHandler = async (e) => {
    e.preventDefault();
    setAddUserDialog(true);
    const prevUsers = activeList?.additional_users;
    try {
      const response = await axiosPrivateInstance.patch(
        `/shopping_list/shopping_lists/${activeList.id}/`,
        {
          additional_users: [...prevUsers, newUser],
        }
      );
      if (response.status === 200) {
        setSuccessMsg("User Successfully Added");
        setActiveList((prevActiveList) => ({
          ...prevActiveList,
          additional_users: [...prevActiveList.additional_users, newUser],
        }));
      }
    } catch (error) {
      setErrMsg("User with provided email does not exist.");
    }
  };

  const removeUserHandler = async (emailToRemove) => {
    const prevUsers = activeList?.additional_users;
    try {
      const response = await axiosPrivateInstance.patch(
        `/shopping_list/shopping_lists/${activeList.id}/`,
        {
          additional_users: [
            ...prevUsers.filter((email) => email !== emailToRemove),
          ],
        }
      );
      setActiveList((prevActiveList) => ({
        ...prevActiveList,
        additional_users: prevActiveList.additional_users.filter(
          (email) => email !== emailToRemove
        ),
      }));
      setSuccessMsg(`User ${emailToRemove} has been removed.`);
    } catch (error) {
      console.log(error);
      setErrMsg("There was an error");
    }
  };

  const addItemToListHandler = async (id, name, type, description) => {
    try {
      const prevItems = activeList?.items;
      const newItem = {
        id: id,
        name: name.toLowerCase(),
        food_type: type,
        description: description,
      };

      const newItemsArray = [...prevItems, newItem];
      const sortedItemsArray = sortFoodItemsByTypeAndName(newItemsArray);
      const response = await axiosPrivateInstance.patch(
        `/shopping_list/shopping_lists/${activeList.id}/`,
        {
          items: sortedItemsArray,
        }
      );
      // Update item id if new was created
      setActiveList(response.data);
      setActiveList((prevActiveList) => ({
        ...prevActiveList,
        items: sortFoodItemsByTypeAndName(response.data.items),
      }));

      const updatedLists = lists.map((list) => {
        if (list.id === activeList.id) {
          return { ...list, items: sortedItemsArray };
        }
        return list;
      });
      setLists(updatedLists);

      // Remove item from used list
      const newPreviousUsedItems = previousUsedItems.filter(
        (item) => item.id !== parseInt(newItem.id)
      );
      setPreviousUsedItems(newPreviousUsedItems);

      //Remove item from search result
      const newSearchedItems = searchResult.filter(
        (item) => item.id !== parseInt(newItem.id)
      );
      setSearchResult(newSearchedItems);
    } catch (error) {
      console.log(error);
    }
  };

  const removeItemFromListHandler = async (itemId) => {
    const itemToRemove = parseInt(itemId);
    const prevItems = [...activeList?.items];
    const newItemsArray = prevItems.filter(
      (item) => parseInt(item.id) !== itemToRemove
    );
    try {
      const response = await axiosPrivateInstance.patch(
        `/shopping_list/shopping_lists/${activeList.id}/`,
        {
          items: newItemsArray,
        }
      );
      setActiveList((prevActiveList) => ({
        ...prevActiveList,
        items: newItemsArray,
      }));
      const updatedLists = lists.map((list) => {
        if (list.id === activeList.id) {
          return { ...list, items: newItemsArray };
        }
        return list;
      });
      setLists(updatedLists);
      const newSearchedItems = searchResult.filter(
        (item) => item.id !== parseInt(itemToRemove)
      );
      setSearchResult(newSearchedItems);
    } catch (error) {
      console.log(error);
    }
  };

  const listLastUsedItemsHandler = async (e) => {
    try {
      const response = await axiosPrivateInstance.get("/shopping_list/items/");
      const lastUsedItems = response.data;
      const filteredUsedItems = lastUsedItems.filter(
        (item) =>
          !activeList?.items?.some((item2) => item.id === parseInt(item2.id))
      );
      setPreviousUsedItems(filteredUsedItems);
    } catch (error) {
      console.log(error);
    }
  };

  const searchItemHandler = async (e) => {
    setSearched(e.toLowerCase());
    setSearchResult([]);
    try {
      const response = await axiosPrivateInstance.get(
        `/shopping_list/items?name=${e}`
      );
      let result = [];
      const filterArray = [...activeList.items];
      if (response.data.length > 0) {
        result = response.data.filter((item) => {
          return !filterArray.some(
            (filterItem) => filterItem.name === item.name
          );
        });
        const newItems = response.data.filter((item) => {
          return filterArray.some(
            (filterItem) => filterItem.name === item.name
          );
        });
        newItems.forEach((item) => {
          item.isExisting = true;
        });
        result = result.concat(newItems);
        const newItem = { id: 0, name: e };
        if (!result.some((item) => item.name === e)) {
          result.push(newItem);
        }

        setSearchResult(result);
      } else {
        const newItem = { food_type: "other", id: 0, name: e };
        result.push(newItem);
        setSearchResult(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    listLastUsedItemsHandler();
  }, [activeList]);

  return (
    <StyledShoppingWrapper className={showList ? "listActive" : "listDisabled"}>
      <StyledNewList
        onClick={exitNewListHandler}
        className={addUserDialog ? "newListActive shadow" : "newListDisabled"}
      >
        <p className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
        <p className={successMsg ? "successmsg" : "offscreen"}>{successMsg}</p>
        <AddUserForm>
          <h1>Add New User to the list:</h1>
          <form onSubmit={addNewUserHandler} action="POST">
            <input
              onChange={(e) => setNewUser(e.target.value)}
              value={newUser}
              type="text"
              placeholder="Enter user email"
            />
            <button type="submit">Submit</button>
          </form>
          <div>
            <h3>Currently shared with: </h3>
            <div className="shared-with">
              {activeList?.additional_users.map((user) => (
                <span key={user}>
                  {user}
                  <FontAwesomeIcon
                    icon={faX}
                    onClick={() => removeUserHandler(user)}
                  />
                </span>
              ))}
            </div>
          </div>
        </AddUserForm>
      </StyledNewList>
      <div className="top-section">
        <FontAwesomeIcon
          onClick={() => setShowList(!showList)}
          className="mobile"
          icon={faBars}
        ></FontAwesomeIcon>
        <span onClick={removeListHandler}>Delete list</span>
        <h2 className="mobile-hidden">{activeList && activeList.title}</h2>

        <FontAwesomeIcon
          className="add-user"
          icon={faUserPlus}
          onClick={addNewListDialogHandler}
        />
      </div>
      <StyledMainShopping>
        <input
          value={searched}
          onChange={(e) => searchItemHandler(e.target.value)}
          placeholder="What would you like to buy?"
          type="text"
        ></input>
        {searched ? (
          <div>
            <h2>Searched:</h2>
            <StyledShoppingItems>
              {searchResult &&
                searchResult.map((item) => (
                  <div key={item.id}>
                    {item.isExisting ? (
                      <ShoppingItem
                        item={item}
                        activeList={activeList}
                        setActiveList={setActiveList}
                        className="active-items"
                        removeItemFromListHandler={removeItemFromListHandler}
                        editable={false}
                      ></ShoppingItem>
                    ) : (
                      <ShoppingItem
                        item={item}
                        addItemToListHandler={addItemToListHandler}
                      ></ShoppingItem>
                    )}
                  </div>
                ))}
            </StyledShoppingItems>
          </div>
        ) : (
          ""
        )}
        <StyledShoppingItems>
          {activeList &&
            activeList.items.map((item) => (
              <ShoppingItem
                key={item.id}
                item={item}
                activeList={activeList}
                setActiveList={setActiveList}
                removeItemFromListHandler={removeItemFromListHandler}
                className="active-items"
                editable={true}
              ></ShoppingItem>
            ))}
        </StyledShoppingItems>
        <h2>Recently Used:</h2>
        <StyledShoppingItems>
          {previousUsedItems &&
            previousUsedItems.map((item) => (
              <ShoppingItem
                key={item.id}
                activeList={activeList}
                setActiveList={setActiveList}
                item={item}
                addItemToListHandler={addItemToListHandler}
                editable={true}
              ></ShoppingItem>
            ))}
        </StyledShoppingItems>
      </StyledMainShopping>
    </StyledShoppingWrapper>
  );
};

const StyledMainShopping = styled.div`
  background: #37474f;
  box-shadow: 0px 10px 5px 0px rgba(0, 0, 0, 0.75);
  padding: 0.5rem 0;
  input {
    margin: 2rem auto;
    display: block;
    text-align: center;
    border: none;
    width: 95%;
    background: #253036;
    color: white;
    font-size: 1.5rem;
    padding: 0.8rem 1rem;
    border-radius: 5px;
  }
  h2 {
    padding: 1rem 1rem;
    color: white;
  }

`;

const StyledShoppingWrapper = styled.div`
  width: 100%;
  flex: 0 0 60vw;
  .top-section {
    display: flex;
    justify-content: space-around;
    background: #78909e;
    color: white;
    align-items: center;
    margin-bottom: 1rem;
    box-shadow: 0px 10px 5px 0px rgba(0, 0, 0, 0.75);
    min-height: 8vh;
    .mobile {
      display: none;
    }
    span {
      background-color: #bf616a;
      padding: 1rem 1rem;
      border-radius: 5px;
      cursor: pointer;
    }
    .add-user {
      cursor: pointer;
      transition: all 0.7s ease;
      :hover {
        color: limegreen;
        scale: 120%;
      }
    }
  }
  @media (max-width: 930px) {
    flex: auto;
    .mobile {
      display: block !important;
      cursor: pointer;
    }
    .mobile-hidden {
      display: none;
    }
  }
`;

const StyledShoppingItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-items: center;
  text-align: center;

  min-height: 20vh;
  padding: 1rem 1rem;
`;

const AddUserForm = styled(motion.div)`
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
  flex-direction: column;
  justify-content: space-around;
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
  .shared-with {
    display: flex;
    flex-direction: column;
    font-size: 0.8rem;
  }
  span {
    padding: 1rem 1rem;
    svg {
      color: red;
      cursor: pointer;
      padding: 0 1rem;
    }
  }
  @media (max-width: 930px) {
    width: 80%;
    left: 10%;
    padding: 1rem 1rem;
  }
  h1 {
    font-size: 1.8rem;
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
export default ShoppingItems;
