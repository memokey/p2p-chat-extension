import React, { FC, useEffect, useState } from "react";
import ACTIONS from "../../config/actions";
import { useAppSelector } from "../../redux/hooks";
import { Menu, Setting } from "../icons";

const ChatContent = ({}: {}) => {
  const [ newMsg, setNewMsg ] = useState("");
  const [ msgs, setMsgs ] = useState([]);
  const { activeUser, onlineUserList, profile } = useAppSelector(state => state.chat);

  useEffect(() => {
    if(onlineUserList.length != 0 && activeUser != "") {
      const user = onlineUserList.find((s: any) => s.name == profile.username);
      setMsgs((user as any).msgs);
    }
  }, [onlineUserList, activeUser])

  const handleKeyDown = (e: any) => {
    if(e.key === 'Enter') {
      sendMsg();
    }
  }

  useEffect(() => {
    if(!!document.querySelector('.ui-chat'))
      (document.querySelector('.ui-chat') as any).scrollTop = (document.querySelector('.ui-chat') as any).scrollHeight
  }, [msgs])

  const sendMsg = () => {
    if(newMsg != "") {
      if(activeUser == "") {
        return;
      }
      // alert(Date());return;
      const msg = {
        members: [profile.username, activeUser],
        date: Date(),
        content: newMsg,
      };
      (window as any).socket.emit(ACTIONS.SEND_MSG_EXTENSION, msg);
      setNewMsg("");
    }
  }
  return (
    <div className="h-[540px]">
      <div className='w-full h-full flex flex-col'>
        <div className='p-5 py-2 text-md flex text-gray-200 border-b-gray-500 border-bborder-b-gray-700 shadow-md shadow-gray-700'>@{activeUser}</div>
        <div className='ui-chat p-5 pt-2 overflow-auto h-full'>
          {msgs && msgs.map((msg: any, index: number) => {
            if(msg.members.find((s: string) => s == activeUser) != -1) {
              var type = 1;
              if(msg.members[0] == profile.username) {
                type = 0;
              }
              return (
                <div className='flex flex-row py-1' key={index}>
                  <div className='rounded-full mr-3 mt-1 flex-shrink-0'>
                    <img src="/avatars/degen.png" className="rounded-full border border-gary-900" alt="" width={40} height={40} />
                  </div>
                  <div>
                    <p className={"text-[16px] " + (type == 1 ? "text-secondary": "text-gray-200")}>{type == 0 ? "You": msg.members[0]}<span className="text-gray-500 pl-2 text-xs">{msg.date.slice(0, 15)}</span></p>
                    <p className='text-[14px] font-normal text-gray-400'>{msg.content}</p>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className='flex w-[100% - 40px] p-5 pt-2'>
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