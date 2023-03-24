// Here goes single shopping item to make code clear
import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import { fadeIn } from "../animations";
import A from "../svg/A.svg";
import B from "../svg/B.svg";
import C from "../svg/C.svg";
import D from "../svg/D.svg";
import E from "../svg/E.svg";
import F from "../svg/F.svg";
import G from "../svg/G.svg";
import H from "../svg/H.svg";
import I from "../svg/I.svg";
import J from "../svg/J.svg";
import K from "../svg/K.svg";
import L from "../svg/L.svg";
import M from "../svg/M.svg";
import N from "../svg/N.svg";
import O from "../svg/O.svg";
import P from "../svg/P.svg";
import R from "../svg/R.svg";
import S from "../svg/S.svg";
import T from "../svg/T.svg";
import U from "../svg/U.svg";
import W from "../svg/W.svg";
import X from "../svg/X.svg";
import Y from "../svg/Y.svg";
import Z from "../svg/Z.svg";
import Q from "../svg/Q.svg";

const ShoppingItem = (props) => {
  const axiosPrivateInstance = useAxiosPrivate();
  const { item } = props;
  const [editItemDialog, setEditItemDialog] = useState(false);
  const [itemToEdit, setItemToEdit] = useState("");
  const [description, setDescription] = useState("");
  const [itemType, setItemType] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const getFirstLetter = (item) => {
    switch (item) {
      case "A":
        return A;
      case "B":
        return B;
      case "C":
        return C;
      case "D":
        return D;
      case "E":
        return E;
      case "F":
        return F;
      case "G":
        return G;
      case "H":
        return H;
      case "I":
        return I;
      case "J":
        return J;
      case "K":
        return K;
      case "L":
        return L;
      case "M":
        return M;
      case "N":
        return N;
      case "O":
        return O;
      case "P":
        return P;
      case "R":
        return R;
      case "S":
        return S;
      case "T":
        return T;
      case "U":
        return U;
      case "W":
        return W;
      case "X":
        return X;
      case "Y":
        return Y;
      case "Z":
        return Z;
      case "Q":
        return Q;
      default:
        return X;
    }
  };

  const editItemSubmitHandler = async (e) => {
    e.preventDefault();
    setEditItemDialog(true);
    try {
      const response = await axiosPrivateInstance.patch(
        `/shopping_list/items/${itemToEdit.id}/`,
        {
          description: description,
          food_type: itemType,
        }
      );
      if (response.status === 200) {
        const updatedItems = props.activeList.items.map((item) => {
          if (item.id === itemToEdit.id) {
            return {
              ...item,
              description: description,
              food_type: itemType,
            };
          }
          return item;
        });
        const updatedActiveList = {
          ...props.activeList,
          items: updatedItems,
        };
        props.setActiveList(updatedActiveList);
        setSuccessMsg("Item updated");
      }
    } catch (error) {
      console.log(error);
      setErrMsg("There was an error");
    }
  };

  const exitEditHandler = (e) => {
    const element = e.target;
    if (element.classList.contains("shadow")) {
      setEditItemDialog(false);
      setErrMsg("");
      setSuccessMsg("");
      setItemToEdit("");
    }
  };

  const editItemHandler = (item) => {
    setEditItemDialog(true);
    setItemToEdit(item);
    setItemType(item.food_type);
    setDescription(item?.description);
  };

  const handleItemTypeChange = (e) => {
    setItemType(e.target.value);
  };

  return (
    <>
      <StyledNewList
        onClick={exitEditHandler}
        className={editItemDialog ? "newListActive shadow" : "newListDisabled"}
      >
        <p className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
        <p className={successMsg ? "successmsg" : "offscreen"}>{successMsg}</p>
        <EditItemForm>
          <h1>Edit Item {itemToEdit.name}</h1>
          <form onSubmit={editItemSubmitHandler} action="POST">
            <input
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              type="text"
              placeholder="Description"
            />
            <select value={itemType} onChange={handleItemTypeChange}>
              <option value="vegetables">vegetables</option>
              <option value="fruits">fruits</option>
              <option value="grains, beans and nuts">
                grains, beans and nuts
              </option>
              <option value="meat and poultry">meat and poultry</option>
              <option value="fish and seafood">fish and seafood</option>
              <option value="dairy foods">dairy foods</option>
              <option value="fat">fat</option>
              <option value="sweets">sweets</option>
              <option value="spices">spices</option>
              <option value="other">other</option>
            </select>
            <button type="submit">Submit</button>
          </form>
        </EditItemForm>
      </StyledNewList>
      <StyledItem
        variants={fadeIn}
        initial="hidden"
        animate="show"
        exit="exit"
        transition={{ duration: 0.5 }}
        className={props.className ? props.className : ""}
        onClick={() =>
          props.addItemToListHandler
            ? props.addItemToListHandler(
                item.id,
                item.name,
                item.food_type,
                item.description ? item.description : ""
              )
            : props.removeItemFromListHandler(item.id)
        }
      >
        {props.editable && (
          <FontAwesomeIcon
            icon={faEllipsisH}
            onClick={(e) => {
              e.stopPropagation();
              editItemHandler(item);
            }}
          />
        )}
        <img
          src={getFirstLetter(props.item.name.charAt(0).toUpperCase())}
        ></img>
        <p>{props.item.name}</p>
        {item.description && <span>{item.description}</span>}
      </StyledItem>
    </>
  );
};

const StyledItem = styled(motion.div)`
  .active-items {
    background: #bf616a;
  }
  color: white;
  height: 116px;
  cursor: pointer;
  width: 98px;
  list-style-type: none;
  background-color: #a3b38c;
  border-radius: 5px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0.3rem 0.3rem;
  img {
    width: 2rem;
    max-height: 45px;
    padding: 0.5rem 0;
  }
  p {
    padding: 0;
    color: white;
  }
  svg {
    margin-left: auto;
    padding: 0.25rem 0.5rem;
  }
  span {
    font-size: 0.8rem;
    margin: 0.2rem 0;
  }
  @media (max-width: 930px) {
    width: 70px;
    height: 90px;
    justify-content: space-evenly;
    img {
      width: 1.5rem;
      padding: 0;
    }
    p {
      font-size: 0.9rem;
    }
    svg {
      padding: 0 0.25rem;
      height: 0.8rem;
    }
    span {
      color: #d6d6d6;
    }
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

const EditItemForm = styled(motion.div)`
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
      color: #37474f;
    }
    select {
      // A reset of styles, including removing the default dropdown arrow
      appearance: none;
      // Additional resets for further consistency
      background-color: #e2e2e2;
      border: none;
      padding: 1rem;
      margin: 0;
      width: 100%;
      text-align: center;
      margin: 1rem 0;
      color: #37474f;
      option:hover {
        background-color: #37474f;
      }
    }
    button {
      background-color: #37474f;
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

export default ShoppingItem;
