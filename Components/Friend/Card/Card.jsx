import React, {useEffect} from "react";
import Style from './Card.module.css';
import Link from "next/link";
import Image from "next/image";
import images from "../../../assets";
const Card = ({readMessage, el, i, readUser}) => {
  return (
    <div onClick={() => (readMessage(el.pubkey), readUser(el.pubkey))}>
    <Link href={{
      pathname:'/', 
      query:{name: `${el.name}`, address: `${el.pubkey}`}}}
    >
          <div className={Style.Card} onClick={()=>(readMessage(el.pubkey), readUser(el.pubkey))}>
      <div className={Style.Card_box}>
        <div className={Style.Card_box_left}>
          <Image src ={images.accountName}
                alt="username"
                width={50}
                height={50}
                className={Style.Card_box_left_img}/>
        </div>
        <div className={Style.Card_box_right}>
          <div className={Style.Card_box_right_middle}>
            <h4>{el.name}</h4>
            <small>{el.pubkey.slice(21)}..</small>
          </div>
          <div className={Style.Card_box_right_end}>
            <small>{i+1}</small>
          </div>
        </div>
      </div>
    </div>
    </Link>
      
    </div>
  );
};

export default Card;
