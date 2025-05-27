import React, {useEffect, useState, useContext} from "react";
import { ChatAppContect } from "../Context/ChatAppContext";
import {Filter, Friend} from "../Components/index";
import { NavBar } from "../Components";
const ChatApp = () => {
  const {} = useContext(ChatAppContect);
  return (
    <div>
      <Filter/>
      <Friend/>
    </div>
  )
};

export default ChatApp;
