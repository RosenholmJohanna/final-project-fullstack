import styled, { createGlobalStyle } from 'styled-components';

// const GlobalStyles = createGlobalStyle`
// *{
//     margin:0;
//     font-family: 'montserrat';
// a {
//     text-decoration: none;
//     color: black;
// }
// } `;

export const LikeAnswerButton = styled.button`
 margin: 5%;
 background-color: transparent;
font-size: 12px;
margin-top: 0%;
 margin-left: 0%;
border-style: none;
text-align: center;
font-size: 12px;
font-style: italic;
`

export const LikeQuestionButton = styled.button`
 margin: 5%;
 background-color: transparent;
font-size: 12px;
margin-top: 0%;
 margin-left: 5%;
border-style: none;
text-align: center;
width: 50px;
font-size: 12px;
font-style: italic;
 `

export const DeleteQuestionButton = styled.button`
background-color: red;
font-size: 10px;
margin: 3%;
padding: 2%;
width: 50px;
height: 25px;
border-radius:5px;
left:calc(30% - 75px);
top:calc(30% - 25px);
margin-bottom: 5%;  
`


export const SaveButton = styled.button`
background-color: green;
font-size: 10px;
margin: 3%;
padding: 2%;
width: 50px;
height:25px;
border-radius:5px;
left:calc(30% - 75px);
top:calc(30% - 25px);
margin-bottom: 3%;
/* box-shadow: 0 1px 1px rgba(216, 204, 204, 0.867);    */
`