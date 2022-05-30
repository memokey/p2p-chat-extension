import React, { FC } from "react";
import { Menu, Setting } from "../icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { togglePanel } from "../../redux/slices/chatSlice";

const LeftBgPanel = ({}: {}) => {
  const dispatch = useAppDispatch();
  const { panelFlag } = useAppSelector(state => state.chat);

  const toggleLeftPanel = () => {
    dispatch(togglePanel(false));
  }

  return (
    <div 
      className={"fixed top-0 right-0 w-[350px] h-[100vh] m-0 bg-[rgba(51, 51, 51, 0.5)] backdrop-blur-sm z-0 " + (panelFlag ? "block": "hidden")}
      onClick={toggleLeftPanel}
    >
    </div>
  );
}

export default LeftBgPanel;