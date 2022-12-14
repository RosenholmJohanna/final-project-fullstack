import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";



export const Header = () => {
    return (
      <Wrapper>
      <HeaderContainer>
        <HeaderText>Planet🌏Space</HeaderText>
        <Text> <Link to="/about"> CONTACT  </Link> </Text>
        <Text> <Link to="/contact">ABOUT</Link></Text>
    </HeaderContainer>
    </Wrapper>
    ) 
}

const Wrapper = styled.main`
margin: 2%;


@media (min-width: 768px) {
    margin: 10%;
  }
`

const HeaderContainer = styled.div`
text-align: center;
border-bottom: 1px solid white;
padding-bottom: 1%;
  display: flex;  
/* justify-content: space-between; */
/* align-items: center; */
a {
  text-decoration: none; 
  color: white;
  text-decoration: none; 
  font-weight: 600;
  font-size: 1.5vh;
  /* justify-content: center; */
}
`
const HeaderText = styled.h1`
font-size: 22px;
margin-top: 6px;
padding-right: 15%;
`

const Text = styled.p`
padding-left: 3%;
`