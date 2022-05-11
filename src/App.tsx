import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from './redux/hooks';

import Header from './components/Header';
import ChatContent from './components/ChatContent';
import LeftPanel from './components/LeftPanel';
import LeftBgPanel from './components/LeftBgPanel';
import socket from './utils/socket-client';
import { ChromeMessage, Sender } from "./types";
import './App.css';
import Login from './components/Login';
import { setAuthFlag, setOnlineUserList, setProfile } from './redux/slices/chatSlice';
import { apiCaller } from './utils/apiCaller';
import ACTIONS from './config/actions';
import { addOnlineUser } from './redux/slices/chatSlice';

function App() {

  const [url, setUrl] = useState<string>('');
  const [responseFromContent, setResponseFromContent] = useState<string>('');

  const dispatch = useAppDispatch();
  const { authFlag } = useAppSelector(state => state.chat);

  /**
   * Get current URL
   */
  useEffect(() => {
    const queryInfo = {active: true, lastFocusedWindow: true};

    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
          const tmpUrl = tabs[0].url;
          setUrl(!!tmpUrl ? tmpUrl: "");
    });
    const authChecker = async () => {
        if(localStorage.getItem('authFlag') == "true" && localStorage.getItem('name') && !(window as any).authFlag) {
            (window as any).authFlag = true;
            (window as any).socket.emit(ACTIONS.JOIN_EXTENSION, {name: localStorage.getItem('name')});
            const {
                data: { user },
            } = await apiCaller.post("/users/getUserInfo/" + localStorage.getItem('name'));
            if(!!user && !!user.username) {
                dispatch(setProfile(user));
                localStorage.setItem('name', user.username);
                localStorage.setItem('authFlag', "true");
            }
        }
      }

    const init_socket = () => {
        (window as any).initFlag = true;

        (window as any).socket.on(ACTIONS.USER_INFO_EXTENSION, (users: any) => {
            dispatch(setOnlineUserList(users));
        });

        (window as any).socket.on(ACTIONS.ADD_USER_EXTENSION, (user: any) => {
            if(!!user && user.name != localStorage.getItem('name')) {
                dispatch(addOnlineUser(user));
            }
        });

        (window as any).socket.on('logout', (data: any) => {
            dispatch(setProfile({}));
            dispatch(setAuthFlag(false));
            dispatch(setOnlineUserList({}));
            localStorage.removeItem("name");
            localStorage.removeItem("authFlag");
            (window as any).socket.disconnect();
            (window as any).socket = undefined;
        });
    }

    if(!(window as any).socket){
        (window as any).socket = socket();
    }
    if(!(window as any).initFlag && (window as any).socket) {
        init_socket();
    }
    authChecker();
  }, []);

  /**
   * Send message to the content script
   */
  const sendTestMessage = () => {
      const message: ChromeMessage = {
          from: Sender.React,
          message: "Hello from React",
      }

      const queryInfo: chrome.tabs.QueryInfo = {
          active: true,
          currentWindow: true
      };

      /**
       * We can't use "chrome.runtime.sendMessage" for sending messages from React.
       * For sending messages from React we need to specify which tab to send it to.
       */
      chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
          const currentTabId: any = tabs[0].id;
          /**
           * Sends a single message to the content script(s) in the specified tab,
           * with an optional callback to run when a response is sent back.
           *
           * The runtime.onMessage event is fired in each content script running
           * in the specified tab for the current extension.
           */
          chrome.tabs.sendMessage(
              currentTabId,
              message,
              (response) => {
                  setResponseFromContent(response);
              });
      });
  };

  const sendRemoveMessage = () => {
      const message: ChromeMessage = {
          from: Sender.React,
          message: "delete logo",
      }

      const queryInfo: chrome.tabs.QueryInfo = {
          active: true,
          currentWindow: true
      };

      chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
          const currentTabId: any = tabs[0].id;
          chrome.tabs.sendMessage(
              currentTabId,
              message,
              (response) => {
                  setResponseFromContent(response);
              });
      });
  };

  return (
    <div className="min-w-[350px] min-h-[550px] bg-bgblack z-0">
        <Header flag={authFlag} />
        {!authFlag ? (
            <Login />
        ): (
            <div>
                <ChatContent />
                <LeftPanel />
                <LeftBgPanel />
            </div>
        )}
    </div>
  );
}

export default App;
