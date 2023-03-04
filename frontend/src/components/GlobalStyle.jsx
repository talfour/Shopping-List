import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* html{
    @media (max-width: 1700px){
        font-size: 75%;
    }
    @media (max-width: 1300px){
        font-size: 80%;
    }
    @media (max-width: 1300px){
        font-size: 80%;
    }
} */

body{
  font-family: "Lato", sans-serif;
background: #F4F4F4;
}
a{
    text-decoration: none;
    color: black;
}

button{
    font-weight: bold;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 1rem 2rem;
    border: 3px solid #212A2F;
    background: transparent;
    color: #d8dee9;
    transition: all 0.5s ease;
    font-family: 'Inter', sans-serif;
    &:hover{
        background-color: #212A2F;
        color: white;
    }
}
h2{
        font-weight: lighter;
        font-size: 2rem;
    }
    a{
        font-size: 1.1rem;
    }
    p{
        padding: 3rem 0rem;
        color: #d8dee9;
        font-size: 1.rem;
        line-height: 150%;
    }

.newListDisabled{
    width: 0;
    opacity: 0;
}
`;



export default GlobalStyle;
