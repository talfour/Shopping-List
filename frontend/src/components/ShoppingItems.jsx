import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faX } from "@fortawesome/free-solid-svg-icons";

const ShoppingItems = ({ activeList, setActiveList, setLists, lists }) => {
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [newUser, setNewUser] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

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

  const removeUserHandler = async (e) => {
    // remove user from list by clicking X next to user name
    const emailToRemove = e.target.dataset.email;
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

  return (
    <StyledShoppingWrapper>
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
                    style={{
                      color: "red",
                      cursor: "pointer",
                      padding: "1rem 1rem",
                    }}
                    icon={faX}
                    onClick={removeUserHandler}
                    data-email={user}
                  />
                </span>
              ))}
            </div>
          </div>
        </AddUserForm>
      </StyledNewList>
      <div className="top-section">
        <span onClick={removeListHandler}>Delete list</span>
        <h2>{activeList && activeList.title}</h2>

        <FontAwesomeIcon
          className="add-user"
          icon={faUserPlus}
          onClick={addNewListDialogHandler}
        />
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
