import React, { FC, useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { Menu, Setting } from "../icons";

const ChatContent = ({}: {}) => {
  const [ newMsg, setNewMsg ] = useState("");
  const { activeUser, onlineUserList, profile } = useAppSelector(state => state.chat);

  useEffect(() => {
    const user = onlineUserList.find((s: any) => s.name == (profile as any).username);
    if(!!user) {
      console.log(user);
      console.log((user as any).msgs);
    }
  }, [])

  const handleKeyDown = (e: any) => {
    if(e.key === 'Enter') {
      sendMsg();
    }
  }

  const sendMsg = () => {
    if(newMsg != "") {
      alert(newMsg);
    }
  }
  return (
    <div className="h-[540px]">
      <div className='w-full h-full flex flex-col gap-1'>
        <div className='p-5 py-2 text-md flex text-gray-200 border-b-gray-500 border-b'>@{activeUser}</div>
        <div className='ui-chat p-5 pt-2 overflow-auto h-full'>
          <div className='flex flex-row py-1'>
            <div className='rounded-full mr-3 mt-1 flex-shrink-0'>
              <img src="/avatars/degen.png" className="rounded-full border border-gary-900" alt="" width={40} height={40} />
            </div>
            <div>
              <p className='text-gray-200 text-[16px]'>Super<span className="text-gray-500 pl-2 text-xs">05/10/2022</span></p>
              <p className='text-[14px] font-normal text-gray-400'>I'd like to develop perfectly.</p>
            </div>
          </div>
        </div>
        <div className='flex w-[100% - 40px] p-5 pt-0'>
          <input
            type="text"
            className="w-full py-2 pl-6 text-[15px] font-light text-white border-transparent border rounded-md focus:outline-none focus:border-gray-500 focus:border focus:text-white placeholder:text-gray-950 bg-brandblack  h-[40px]"
            value={newMsg}
            onKeyDown={handleKeyDown}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Input a message please."
            />
        </div>
      </div>
    </div>
  );
}

export default ChatContent;