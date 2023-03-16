// Here goes single shopping item to make code clear
import styled from "styled-components";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";

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

const ShoppingItem = ({ handler, item }) => {
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

  return (
    <StyledItem
      onClick={handler}
      data-id={item.id}
      data-name={item.name}
      data-type={item?.food_type}
          key={item.id}

    >
      <FontAwesomeIcon icon={faEllipsisH} />
      <img src={getFirstLetter(item.name.charAt(0).toUpperCase())}></img>
      {item.name}
    </StyledItem>
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
    width: 3rem;
    padding: 0.5rem 0;
  }
`;

export default ShoppingItem;
