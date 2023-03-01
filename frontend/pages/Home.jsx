import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

const Home = () => {
  const { user, authTokens, logoutUser } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    console.log(`Bearer ${authTokens.access}`);
    const response = await fetch(
      "http://127.0.0.1:8000/api/shopping_list/shopping_lists/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      setItems(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  return (
    <div>
      <div> {user && <p>Hi {user.name}</p>}</div>
      <div>
        <h1>Your shopping lists</h1>
        {items.map((item) => (
          <p key={item.id}>{item.title}</p>
        ))}
      </div>
    </div>
  );
};

export default Home;
