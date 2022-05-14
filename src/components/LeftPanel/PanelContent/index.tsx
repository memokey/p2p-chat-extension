import React, { FC } from "react";
import { useAppSelector } from "../../../redux/hooks";
import GroupList from "./GroupList";
import UserList from "./UserList";

const PanelContent = ({}: {}) => {
  const { groupIndex } = useAppSelector(state => state.chat);

  return (
    <div>
      {groupIndex == 0 ? (
        <UserList />
      ) : (
        <GroupList />
      )}
    </div>
  );
}

export default PanelContent;