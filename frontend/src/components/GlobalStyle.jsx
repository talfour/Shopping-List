import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html{
    @media (max-width: 1700px){
        font-size: 75%;
    }
    @media (max-width: 1300px){
        font-size: 80%;
    }
    @media (max-width: 1300px){
        font-size: 80%;
    }
}

body{
    background: #1b1b1b;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
}

button{
    font-weight: bold;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 1rem 2rem;
    border: 3px solid #5e81ac;
    background: transparent;
    color: #d8dee9;
    transition: all 0.5s ease;
    font-family: 'Inter', sans-serif;
    &:hover{
        background-color: #5e81ac;
        color: white;
    }
}
h2{
        font-weight: lighter;
        font-size: 4rem;
    }
    h3{
        color: #d8dee9;
    }
    h4{
        font-weight: bold;
        font-size: 2rem;
    }
    span{
        font-weight: bold;
        color: #5e81ac;
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
`;

export default GlobalStyle;
