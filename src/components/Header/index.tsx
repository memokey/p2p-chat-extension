import React, { FC } from "react";
import { Menu, Setting } from "../icons";
import { useAppDispatch } from "../../redux/hooks";
import { setAuthFlag, setOnlineUserList, setProfile, togglePanel } from "../../redux/slices/chatSlice";

const Header = ({ flag }: { flag: Boolean }) => {
  const dispatch = useAppDispatch();

  const toggleLeftPanel = () => {
    dispatch(togglePanel(true));
  }

  const logout = () => {
    dispatch(setProfile({}));
    dispatch(setAuthFlag(false));
    dispatch(setOnlineUserList({}));
    localStorage.removeItem("name");
    localStorage.removeItem("authFlag");
    (window as any).socket.disconnect();
    (window as any).socket = undefined;
  }

  return (
    <header
      className="flex items-center justify-between px-5 py-3 border-b border-b-gray-700"
    >
      <div className="text-gray-300 cursor-pointer" onClick={toggleLeftPanel}>
        <Menu />
      </div>
      <div className="text-gray-300 text-2xl">
        P2P chat
      </div>
      {flag ? (
        <div className="text-gray-300 cursor-pointer" onClick={logout}>
          <Setting />
        </div>
      ): (<div></div>)}
    </header>
  );
}

export default Header;