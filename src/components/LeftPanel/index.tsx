import React, { FC } from "react";
import { Menu, Setting } from "../icons";
import { useAppSelector } from "../../redux/hooks";
import PanelHeader from "./PanelHeader";
import PanelContent from "./PanelContent";

const LeftPanel = ({}: {}) => {
  const { panelFlag } = useAppSelector(state => state.chat);

  return (
    <div 
      className={"absolute z-20 transition-all ease-in-out w-[200px] " + (panelFlag ? "-left-0 duration-300": "left-[-200px] duration-0") + " top-0 bottom-0 border-right border-right-white bg-bgblack border-r border-r-darkcharcoal shadow-lg shadow-darkcharcoal"}
    >
      {panelFlag && (
        <div 
          className=""
        >
          <PanelHeader />
          <PanelContent />
        </div>
      )}
    </div>
  );
}

export default LeftPanel;