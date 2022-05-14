import React, { FC, useEffect, useState, useCallback, createRef } from "react";
import ACTIONS from "../../config/actions";
import { useAppSelector } from "../../redux/hooks";
import { create } from 'ipfs';
import toBuffer from 'blob-to-buffer';
import { Buffer } from "buffer";
import Dropzone from 'react-dropzone';
import async from 'async';
import { ClipboardCheck, CloudUpload, Download, Plus } from "../icons";

var ipfs = window.ipfs;
window.Buffer = Buffer;

const ChatContent = (props) => {
  const [ newMsg, setNewMsg ] = useState("");
  const [ msgs, setMsgs ] = useState([]);
  const { activeUser, onlineUserList, profile } = useAppSelector(state => state.chat);
  const [ loaded, setLoaded ] = useState(false);
  const [ filename, setFileName ] = useState("");
  const [ filetype, setFileType ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [ uploadPath, setUploadPath ] = useState("");
  const [ active, setActive ] = useState(false);
  const [ dragFlag, setDragFlag ] = useState(false);

  useEffect(() => {
    if(!ipfs && !window.ipfs && !props.ipfs){
      console.debug("=> IPFS Dropzone: Creating IPFS node")
      async function initIPFS(){
        ipfs = await create({repo: 'ok' + Math.random()})
        setActive(true);
        window.ipfs = ipfs;
        console.debug("=> IPFS Dropzone: IPFS node created")
      }
      initIPFS()
    }else if(window.ipfs && !ipfs){
      console.debug("=> IPFS Dropzone: Reusing open IPFS node")
      ipfs = window.ipfs;
      setActive(true);
    }else if(props.ipfs){
      ipfs = props.ipfs;
      window.ipfs = ipfs;
      setActive(true);
    }
  }, [window.ipfs, props.ipfs]) 

  const onDrop = useCallback((files) => {
    setDragFlag(false);
    if(files && files.length > 0){
      if(props.onLoadStart) props.onLoadStart(files.map((x) => parseName(x.name)));
      async.map(files, (file, cb) => {
        setLoading(true);
        setFileName(file.name);
        setFileType(file.type);
        toBuffer(file, async (err, buff) => {
          if(err) return cb(err)
          if(!ipfs) { setLoading(false);setFileName("");return; }
          ipfs.add(buff).then((results) => {
            setLoading(false);
            setLoaded(true);
            setUploadPath('https://ipfs.io/ipfs/' + results.path);
            console.debug("=> IPFS Dropzone added: ", results.cid.string)
            let _file = parseName(file.name)
            cb(null, {..._file, cid: results.cid.string})
          })
        })
      }, (err, results) => {
        if(err) return console.error("=> IPFS Dropzone: IPFS Upload Error: ", err)
        if(props.onLoad) props.onLoad(results)
      })
    }
  }, [])

  const parseName = (name) => {
    let ext = name.match(/\.[^/.]+$/)
    let file = name.replace(/\.[^/.]+$/, "")
    return {
      ext: ext ? ext[0] : null,
      name: file
    }
  }

  const dropzoneRef = createRef()
  
  const rootProps = {
    onClick: (e) => {
      if(props.dropOnly) e.stopPropagation();
    }
  }

  useEffect(() => {
    if(activeUser == "") {
      setMsgs([]);
    }

    if(onlineUserList.length != 0 && activeUser != "") {
      const user = onlineUserList.find(s => s.name == profile.username);
      if(!!user) {
        var userMsgs = [];
        for(var i = 0; i < user.msgs.length; i ++) {
          if(user.msgs[i].members.findIndex(s => s == profile.username) != -1 && user.msgs[i].members.findIndex(s => s == activeUser) != -1)
          userMsgs.push(user.msgs[i])
        }
        setMsgs(userMsgs);
      }
    }
  }, [onlineUserList, activeUser])

  const handleKeyDown = e => {
    if(e.key === 'Enter') {
      sendMsg();
    }
  }

  useEffect(() => {
    if(!!document.querySelector('.ui-chat'))
      document.querySelector('.ui-chat').scrollTop = document.querySelector('.ui-chat').scrollHeight
  }, [msgs])

  const sendMsg = () => {
    if(newMsg == "" && uploadPath == "" || activeUser == "") {
      return;
    }
    const msg = {
      members: [profile.username, activeUser],
      date: Date(),
      content: newMsg,
      uploadPath: uploadPath,
      filename: filename,
      filetype: filetype,
    };
    window.socket.emit(ACTIONS.SEND_MSG_EXTENSION, msg);
    setNewMsg("");
    setLoaded(false);
    setLoading(false);
    setUploadPath("");
    setFileName("");
    setFileType("");
  }
  return (
    <div className="h-[540px] relative" onDragEnter={() => setDragFlag(true)}>
      <div>
        {active && dragFlag && (
          <Dropzone ref={dropzoneRef} onDrop={onDrop}>
            {({getRootProps, getInputProps, isDragActive}) => (
              <div className="react-ipfs-dropzone absolute w-[350px] h-[540px]" {...getRootProps(rootProps)} {...props} onDragLeave={() => setDragFlag(false)}>
                <input {...getInputProps()}/>
              </div>
            )}
          </Dropzone>
        )}
      </div>
      <div className='w-full h-full flex flex-col'>
        <div className='p-5 py-2 text-md flex text-gray-200 border-b-gray-500 border-bborder-b-gray-700 shadow-md shadow-gray-700'>@{activeUser}</div>
        <div className='ui-chat p-5 pt-2 overflow-auto h-full'>
          {msgs && msgs.map((msg, index) => {
            if(msg.members.find(s => s == activeUser) != -1) {
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
                    <div className='text-[14px] font-normal text-gray-400'>
                      {msg.content}
                      {msg.uploadPath != "" && (
                        <div className="text-secondary">
                          {msg.filetype.indexOf('image') != -1 && (
                            <img src={msg.uploadPath} width={300} className="pb-1"/>
                          )}
                          <a href={msg.uploadPath + "?filename=" + msg.filename + "&download=true"} className="flex"><span className="pt-[2px]">{msg.filename}</span>&nbsp;&nbsp;<Download /></a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className='flex w-[100% - 40px] p-5 pt-2 h-20'>
          <div className="relative">
            <input
              type="text"
              className="absolute left-0 top-0 w-[310px] py-2 pl-10 text-[15px] font-light text-white border-transparent border rounded-md focus:outline-none focus:border-gray-500 focus:border focus:text-white placeholder:text-gray-950 bg-brandblack  h-[40px]"
              value={newMsg}
              onKeyDown={handleKeyDown}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Input a message please."
            />
            <div className="absolute left-0 top-0 z-0">
              {active && (
                <Dropzone ref={dropzoneRef} onDrop={onDrop}>
                  {({getRootProps, getInputProps, isDragActive}) => (
                    <div className="react-ipfs-dropzone" {...getRootProps(rootProps)} {...props}>
                      <input {...getInputProps()}/>
                      <div className="">
                        {
                          !loaded && !loading ?
                            (<div className="p-2 text-gray-300 cursor-pointer"><Plus /></div>) : 
                            loading ? (<div className="p-2 text-gray-300 cursor-pointer"><CloudUpload /></div>) : 
                            (<div className="p-2 text-gray-300 cursor-pointer"><ClipboardCheck /></div>)
                        }
                      </div>
                    </div>
                  )}
                </Dropzone>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContent;