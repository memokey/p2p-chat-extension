import React, { FC } from "react";
import { Menu, Puzzle, Setting, ShieldCheck, Sparkles, Star } from "../icons";
import { useAppSelector } from "../../redux/hooks";
import PanelHeader from "./PanelHeader";
import PanelContent from "./PanelContent";
import HomeGroupItem from "./HomeGroupItem";
import Divider from "./Divider";
import GroupItem from "./GroupItem";

const LeftPanel = ({}: {}) => {
  const { panelFlag, groupIndex } = useAppSelector(state => state.chat);

  return (
    <div 
      className={"absolute z-0 transition-all ease-in-out w-[250px] " + (panelFlag ? "-left-0 duration-300": "left-[-250px] duration-0") + " top-0 bottom-0 border-right border-right-white bg-bgblack border-r border-r-darkcharcoal shadow-lg shadow-darkcharcoal"}
    >
      {panelFlag && (
        <div 
          className="h-full"
        >
          <div
            className="flex grid-cols-4 h-full"  
          >
            <div className="colspan-1 border-r border-r-darkcharcoal h-full bg-bg1black p-2 pt-5">
              <HomeGroupItem />
              <Divider />
              <GroupItem type="default" itemIcon={<Star />} title="Solarity" index={1}/>
              <GroupItem type="default" itemIcon={<ShieldCheck />} title="Money Boys" index={2}/>
              <GroupItem type="default" itemIcon={<Sparkles />} title="Sol Gods" index={3}/>
            </div>
            <div className="colspan-3 w-full">
              <PanelHeader />
              <PanelContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeftPanel;