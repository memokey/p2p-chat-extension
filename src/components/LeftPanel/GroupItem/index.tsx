import React, { FC } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setGroupIndex } from "../../../redux/slices/chatSlice";

const GroupItem = ({
  type,
  itemIcon, 
  title,
  index,
}: {
  type: string, 
  itemIcon: React.ReactNode, 
  title: string,
  index: number,
}) => {
  const dispatch = useAppDispatch();
  const { groupIndex } = useAppSelector(state => state.chat);

  const itemClick = () => {
    dispatch(setGroupIndex(index));
  }

  return (
    <Tooltip
      title={title}
      placement="right"
      arrow
    >
      <div className={"text-3xl text-gray-300 p-2 transition duration-500 bg-bgblack rounded-full cursor-pointer hover:bg-secondaryhover hover:rounded-2xl hover:text-gray-50 my-2 " + (groupIndex == index ? "rounded-2xl bg-secondaryhover": "bg-bgblack rounded-full")} onClick={itemClick}>
        {itemIcon}
      </div>
    </Tooltip>
  );
}

export default GroupItem;