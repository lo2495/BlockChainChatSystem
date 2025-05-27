import React ,{useState, useContext} from "react";
import Image from "next/image";
import Style from './Filter.module.css';
import images from '../../assets';
import { ChatAppContect } from "../../Context/ChatAppContext";
import { Model }from "../index";
const Filter = () => {
  const {account, addFriends} = useContext(ChatAppContect);
  const {} = useContext(ChatAppContect);
  //UseState
  const [addFriend, setAddFriend] = useState(false);
  return (
    <div className={Style.Filter}>
      <div className={Style.Filter_box}>
        <div className={Style.Filter_box_left}>
        </div>
        <div className={Style.Filter_box_right}>
          <button onClick={()=> setAddFriend(true)}>
            <Image src={images.user}
            alt ="clear"
            width={20}
            height={20}/>
            Add Friend
          </button>
        </div>
      </div>
      {addFriend && (
        <div className={Style.Filter_model}>
        <Model openBox={setAddFriend}
        title = "WELCOME TO"
        head="CHAT APP"
        info="This is a blockchain chat system"
        smallInfo="Kindley Select Your Friend Name & Address..."
        image={images.hero}
        functionName={addFriends}
        />
        </div>
      )}
    </div>
  )
};

export default Filter;
