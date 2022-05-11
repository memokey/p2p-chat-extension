import React, { FC } from "react";

const GroupList = ({}: {}) => {

  const groups = ["a-frame", "api-integration", "extension"];

  return (
    <div className="my-2">
      <div className="text-md text-gray-300 px-5 pb-2">Channel</div>
      {/* <div className="py-1 px-5 text-gray-100 cursor-pointer bg-secondary hover:bg-darkcharcoal">
          {"# " + "active group"}
        </div> */}
      {groups.map((group, index) => (
        <div className="py-1 px-5 text-gray-400 cursor-pointer hover:bg-darkcharcoal" key={index}>
          {"# " + group}
        </div>
      ))}
    </div>
  );
}

export default GroupList;