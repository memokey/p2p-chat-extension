import React, { FC } from "react";
import { Home } from "../../icons";
import Tooltip from "@material-ui/core/Tooltip";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setGroupIndex } from "../../../redux/slices/chatSlice";

const HomeGroupItem = ({}: {}) => {
  const dispatch = useAppDispatch();
  const { groupIndex } = useAppSelector(state => state.chat);
  const itemClick = () => {
    dispatch(setGroupIndex(0));
  }

  return (
    <Tooltip
      title="Home"
      placement="right"
      arrow
    >
      <div 
        className={"text-3xl text-gray-300 p-2 transition duration-500 cursor-pointer hover:bg-secondaryhover hover:rounded-2xl hover:text-gray-50 my-1 " + (groupIndex == 0 ? "rounded-2xl bg-secondaryhover": "bg-bgblack rounded-full")} 
        onClick={itemClick}
      >
        <Home />
      </div>
    </Tooltip>
  );
}

export default HomeGroupItem;