import {useEffect, useState, useRef} from "react";
import socketIOClient from "socket.io-client";

const useChat = () => {
  const socketRef = useRef();
  const [messages, setMessages] = useState([]);

  //when component mounts and changes
  useEffect(() =>{
    socketRef.current = socketIOClient("http://localhost:5001");

    socketRef.current.on("mostRecentMessages", (mostRecentMessages) =>{

      setMessages(messages => [...mostRecentMessages]);
    });

    socketRef.current.on("newChatMessage",({user_name, user_avatar, message_text}) =>{
      setMessages(messages => [...messages, {user_name: user_name, user_avatar: user_avatar, message_text: message_text}]);
    })

    return ()=>{
      socketRef.current.disconnect();
    }
  },[]);

  const sendMessage = (messageObject) =>{
    socketRef.current.emit("newChatMessage", messageObject)
  }

  return {messages, sendMessage};
}

export default useChat;