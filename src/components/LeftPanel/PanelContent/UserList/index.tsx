import React, { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setActiveUser } from "../../../../redux/slices/chatSlice";

const UserList = ({}: {}) => {
  const { onlineUserList, activeUser, profile } = useAppSelector(state => state.chat);
  const dispatch = useAppDispatch();

  const activeUserFunc = (name: string) => {
    dispatch(setActiveUser(name));
  }

  return (
    <div className="my-2">
      <div className="text-md text-gray-300 px-5 pb-2">Direct Messages</div>
      {!!onlineUserList && onlineUserList.map((user: any, index) => {
        if(user.name != (profile as any).username) {
          return (
            <div className={"py-1 px-5 flex cursor-pointer " + (activeUser == user.name ? "bg-secondary text-gray-100": "text-gray-400 hover:bg-darkcharcoal")} key={index} onClick={() => activeUserFunc(user.name)}>
              <img className="rounded-md border border-gray-900" src={"/avatars/degen.png"} width={30} height={30} />
              <p className="pl-2">{user.name}</p>
            </div>
          );
        }
      })}
    </div>
  );
}

export default UserList;