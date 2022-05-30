import React, { FC, useEffect, useState } from "react";
import { Menu, Puzzle, Setting, ShieldCheck, Sparkles, Star } from "../icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import PanelHeader from "./PanelHeader";
import PanelContent from "./PanelContent";
import HomeGroupItem from "./HomeGroupItem";
import Divider from "./Divider";
import GroupItem from "./GroupItem";
import { apiCaller } from "../../utils/apiCaller";
import { setDaos } from "../../redux/slices/chatSlice";

const LeftPanel = ({}: {}) => {
  const { panelFlag, groupIndex } = useAppSelector(state => state.chat);
  const [ daolist, setDaoList ] = useState([]);
  const dispatch = useAppDispatch();

  const icons=[<Star />, <ShieldCheck />, <Sparkles />];

  useEffect(() => {
    const getDaos = async () => {
      const {
        data: { daos },
      } = await apiCaller.get("/daos/");
      setDaoList(daos);
      dispatch(setDaos(daos));
    };
    getDaos();
  }, [])

  return (
    <div 
      className={"absolute z-0 transition-all ease-in-out w-[250px] " + (panelFlag ? "-left-0 duration-300 block": "left-[-250px] duration-0 hidden") + " top-0 bottom-0 border-right border-right-white bg-bgblack border-r border-r-darkcharcoal shadow-lg shadow-darkcharcoal"}
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
              {!!daolist && daolist.map((dao: any, index) => (
                <GroupItem type="default" itemIcon={icons[index]} title={dao.name} index={index + 1} key={index + 1} />
              ))}
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