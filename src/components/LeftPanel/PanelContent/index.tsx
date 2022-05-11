import React, { FC } from "react";
import GroupList from "./GroupList";
import UserList from "./UserList";

const PanelContent = ({}: {}) => {

  return (
    <div>
      <GroupList />
      <UserList />
    </div>
  );
}

export default PanelContent;