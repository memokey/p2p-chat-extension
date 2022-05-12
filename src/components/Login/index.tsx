import React, { FC, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { Menu, Setting } from "../icons";
import { apiCaller } from "../../utils/apiCaller";
import { setProfile, setAuthFlag } from "../../redux/slices/chatSlice";
import ErrorMessage from "../utils/ErrorMessage";
import socket from "../../utils/socket-client";
import ACTIONS from "../../config/actions";

const Login = ({}: {}) => {
  const [ newMsg, setNewMsg ] = useState("");
  const [ name, setName ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");

  const dispatch = useAppDispatch();

  const handleKeyDown = (e: any) => {
    if(e.key === 'Enter') {
      sendMsg();
    }
  }

  const sendMsg = () => {
    if(newMsg != "") {
      alert(newMsg);
    }
  }

  const login = async () => {
    if(name == "") {
      setErrorMessage("Name field is empty.");
      return;
    }

    try {
      const {
        data: { user },
      } = await apiCaller.get("/users/getUserInfo/" + name);
      if(!!user && !!user.username) {
        dispatch(setProfile(user));
        localStorage.setItem('name', user.username);
        localStorage.setItem('authFlag', "true");
        if(!!(window as any).socket) {
          (window as any).socket.emit(ACTIONS.JOIN_EXTENSION, {name: user.username});
        }
        setErrorMessage("");
      } else {
        setErrorMessage("Server is happened some errors.");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  }
  return (
    <div className="h-[540px]">
      <div className='w-full h-full'>
        <div className="flex justify-center pt-28">
          <img src="/images/solarityround.png" width="100" height="100"/>
        </div>
        <div className="text-gray-300 text-center text-3xl font-medium pt-2">
          Enter your name
        </div>
        <div className="pt-7 px-5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full py-3 pl-6 text-[15px] font-light text-white border-transparent border rounded-md focus:outline-none border-gray-500 placeholder:text-gray-950 bg-brandblack  h-[40px]"
            placeholder="Name"
          />
          {errorMessage != "" && (
            <ErrorMessage errorMessage={errorMessage}/>
          )}
        </div>
        <div className="pt-32 px-5">
          <button className="gap-3 text-lg font-bold btn rounded-xl btn-primary bg-secondary py-2 w-full text-gray-200 hover:bg-secondaryhover transition delay-100" onClick={login}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default Login;