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
import { removeOnlineUser, setActiveUser, setAuthFlag, setGroupMsg, setGroupMsgs, setOnlineUserList, setProfile, setUserMsg } from './redux/slices/chatSlice';
import { apiCaller } from './utils/apiCaller';
import ACTIONS from './config/actions';
import { addOnlineUser } from './redux/slices/chatSlice';
import { toast } from 'react-toastify';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Chat } from './components/icons';

function App() {

  const [ url, setUrl ] = useState<string>('');
  const [ responseFromContent, setResponseFromContent ] = useState<string>('');
  const [ panelState, setPanelState ] = useState(false);

  const dispatch = useAppDispatch();
  const { authFlag, activeUser, onlineUserList, profile } = useAppSelector(state => state.chat);

  useEffect(() => {
    if(onlineUserList.length != 0) {
      const user = onlineUserList.find(s => s.name != profile.username);
      if(!!user) {
          if(activeUser == "") {
              dispatch(setActiveUser(user.name));
          }
      } else {
          dispatch(setActiveUser(""));
      }
    }
  }, [onlineUserList])

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
            } = await apiCaller.get("/users/getUserInfo/" + localStorage.getItem('name'));
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
            if(!!user) {
                dispatch(addOnlineUser(user));
            }
        });

        (window as any).socket.on(ACTIONS.REMOVE_USER_EXTENSION, (name: string) => {
            if(!!name && name != "") {
                dispatch(removeOnlineUser(name));
            }
        });

        (window as any).socket.on(ACTIONS.GET_GROUP_MSGS, (data: any) => {
            if(!!data.msgs && !!data.daoId) {
                dispatch(setGroupMsgs({ daoId: data.daoId, msgs: data.msgs }));
            }
        });

        (window as any).socket.on(ACTIONS.SEND_MSG_EXTENSION, (msg: any) => {
            if(!!msg) {
                if(msg.groupType) {
                    dispatch(setGroupMsg(msg));
                } else {
                    dispatch(setUserMsg(msg));
                }
                if(msg.members[0] != localStorage.getItem('name') && localStorage.getItem('authFlag') == "true") {
                    toast.success(msg.content, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            }
        });

        (window as any).socket.on('logout', (data: any) => {
            dispatch(setProfile({}));
            dispatch(setAuthFlag(false));
            dispatch(setOnlineUserList([]));
            localStorage.removeItem("name");
            localStorage.removeItem("authFlag");
            (window as any).socket.disconnect();
            (window as any).socket = undefined;
            (window as any).authFlag = false;
            (window as any).initFlag = false;
        });
    }
    if(!(window as any).socket){
        (window as any).socket = socket();
    }
    if(!(window as any).initFlag && (window as any).socket) {
        init_socket();
    }
    authChecker();
  }, [authFlag]);

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

  const togglePanel = () => {
      setPanelState(false);
      localStorage.setItem('toggle-sharity-panel', "false");
  }

  useEffect(() => {
      if(panelState) {
          document.getElementsByTagName('body')[0].style.setProperty('margin-right', 'auto', '')
      } else {
          document.getElementsByTagName('body')[0].style.setProperty('margin-right', '350px', 'important');
      }
  }, [panelState])

  useEffect(() => {
    if(localStorage.getItem('toggle-sharity-panel') == "true"){
        setPanelState(true);
    } else {
        setPanelState(false);
    }
  }, [])

  if(panelState) {
   return (
       <div className='bg-gray-900 text-gray-100 p-2 shadow-2xl shadow-gray-500 rounded-full mt-2 mr-2 cursor-pointer' onClick={togglePanel}>
           <Chat />
           <ToastContainer
            style={{ position: "fixed", zIndex: "100000000" }}
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            />
       </div>
   );   
  }
  return (
    <div className="!min-w-[350px] !min-h-[100vh] !bg-bgblack !z-[10000]">
        <Header flag={authFlag} setPanelState={setPanelState} />
        {!authFlag ? (
            <Login />
        ): (
            <div className='h-full'>
                <ChatContent />
                <LeftBgPanel />
                <LeftPanel />
            </div>
        )}
        <ToastContainer
          style={{ position: "fixed", zIndex: "100000000" }}
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
    </div>
  );
}

export default App;
