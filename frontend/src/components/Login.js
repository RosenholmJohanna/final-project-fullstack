import React, {useEffect, useState} from "react";
import { useDispatch, useSelector, batch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../utils/utils";
import user from "../reducers/user";
import styled from "styled-components";

// OBS below is out comented in server!!
// //app.get("/questions", authenticateUser, authenticateAdmin);

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //const [adminname, setAdminname] = useState("");
    //const [password, setPassword] = useState("");
    const [mode, setMode] = useState("login");
     const dispatch = useDispatch();
     const navigate = useNavigate();
    const accessToken = useSelector((store) => store.user.accessToken);// click loggin - reponse with token in network - tooken stored in slice - we go there to get it
    
    useEffect(() => {
        if (accessToken) {
            navigate("/");
        }
    }, [accessToken])


    const onFormSubmit =(event) => {
    event.preventDefault();
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //"Authorization": accessToken
            },
            body: JSON.stringify({username: username, password: password})
        }
        fetch(API_URL(mode), options) //(mode)
          .then(response => response.json())
          .then(data => {
                // console.log(data)
            if(data.success) { 
                 batch(()=> {
                    // this 4 happens if we have successfull respons
                    dispatch(user.actions.setUsername(data.response.username)); //if success we go to redux/reducer batch - fire multiple dispatch, but only happen when rerender page
                    dispatch(user.actions.setUserId(data.response.id))
                    dispatch(user.actions.setAccessToken(data.response.accessToken));
                    dispatch(user.actions.setError(null));
                    });
            } else {
                // else if we dont have succesfull response
                batch (() => {
                    dispatch(user.actions.setUsername(null)); 
                    dispatch(user.actions.setUserId(null))
                    dispatch(user.actions.setAccessToken(null));
                    dispatch(user.actions.setError(data.response));
                });
               }
        })
    }
    return (
        <StartPage>
        <Loginpagetext>
          Register/Login Page
        </Loginpagetext>
{/*        
        <label htmlFor="register">New user? 
        <input
            type="radio" label="register" id="register" 
            checked={mode === "register"} 
            onChange={()=>setMode("register")}/> 
        </label> */}
        
        <label htmlFor="login">Already a user?
        <input
            type="radio" id="login" 
            checked={mode === "login"}
            onChange={()=>setMode("login")}/>
        </label>
       
        <form onSubmit={onFormSubmit}>
            <label htmlFor="username">Username</label>
        <input 
            required
            type="text" 
            id="username" 
            placeholder="username"
            value={username} 
            onChange={e => setUsername(e.target.value)}/>
            <label htmlFor="Password">Password</label>
        
        <input
            required 
            type="password" 
            id="password" 
            placeholder="password"
            value={password} 
            onChange={e => setPassword(e.target.value)}/>
        <button type="submit">Submit</button>
        </form>
    </StartPage> 
    );
}

export default Login;







const StartPage = styled.div `
text-align: center;
color: white;
display: flex;
flex-direction: column; 
`

const Loginpagetext = styled.h1 `
margin: 5%;
color: white;
`

