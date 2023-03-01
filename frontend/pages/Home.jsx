import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import useFetch from "../utils/useFetch";

const Home = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const { authTokens, logoutUser } = useContext(AuthContext);

  const api = useFetch();

  useEffect(() => {
    getShoppingLists();
  }, []);

  const getShoppingLists = async () => {
    const { response, data } = await api("/api/shopping_list/shopping_lists/");
    if (response.status === 200) {
      setShoppingLists(data);
    }
  };

  return (
    <div>
      <p>You are logged to the home page!</p>

      <ul>
        {shoppingLists.map((shoppingList) => (
          <li key={shoppingList.id}>{shoppingList.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
