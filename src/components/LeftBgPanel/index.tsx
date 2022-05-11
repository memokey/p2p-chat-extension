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
      className={"fixed left-0 bottom-0 w-full h-full m-0 bg-[rgba(51, 51, 51, 0.5)] backdrop-blur-sm z-10 " + (panelFlag ? "block": "hidden")}
      onClick={toggleLeftPanel}
    >
    </div>
  );
}

export default LeftBgPanel;