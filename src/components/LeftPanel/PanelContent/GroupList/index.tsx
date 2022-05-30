import React, { FC } from "react";

const GroupList = ({}: {}) => {

  const groups = ["a-frame", "api-integration", "extension"];

  return (
    <div className="my-2">
      <div className="text-md text-gray-300 px-5 pb-2">Channels</div>
      <div className="py-1 px-5 text-gray-100 cursor-pointer bg-secondary hover:bg-darkcharcoal" key={0}>
        {"# " + "general"}
      </div>
    </div>
  );
}

export default GroupList;