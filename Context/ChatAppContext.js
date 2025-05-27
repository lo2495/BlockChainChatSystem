import React, { useState, useEffect} from "react";
import { useRouter }from "next/router";
import { CheckIfWalletConnected, connectWallet, connectingWithContract } from "../Utils/apiFeature";

export const ChatAppContect = React.createContext();

export const ChatAppProvider = ({children}) =>{
    const [account, setAccount] = useState("");
    const [userName, setUserName] = useState("");
    const [friendLists, setFriendLists] = useState([]);
    const [friendMsg, setFriendMsg] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userLists, setUserLists] = useState([]);
    const [error, setError] = useState("");

    const [currentUserName, setCurrentUserName] = useState("");
    const [currentUserAddress, setCurrentUserAddress] = useState("");
    const router = useRouter();

    const fetchData = async()=>{
        try{
            const address = await CheckIfWalletConnected();
            if (address) {
            //Get Contract
            const contract = await connectingWithContract();
            //Get Account
            const connectAccount = await connectWallet();
            setAccount(connectAccount);
            //Get UserName
            const userName = await contract.getUsername(connectAccount);
            setUserName(userName);
            //Get My Friend List
            const friendLists = await contract.getMyFriendList();
            setFriendLists(friendLists);
            //Get All App User List
            const userList = await contract.getAllAppUser();
            const newArray = userList.filter(
                (user) => user.accountAddress.toLowerCase() !== address
              );
      
              const filterArray = filterUsersExcludingFriends(newArray, friendLists);
            setUserLists(filterArray);
            }
        }catch(error){
            // setError("Please Install And Connect Your Wallet");
            console.log(error)
        }
    };

    function filterUsersExcludingFriends(newArray, friendLists) {
        const friendAddresses = new Set(friendLists.map((friend) => friend.pubkey));
    
        return newArray.filter((user) => !friendAddresses.has(user.accountAddress));
      }

    useEffect(()=>{
        fetchData();
    },[]);

    //Read Message
    const readMessage = async(friendAddress) =>{
        try{
            const address = await CheckIfWalletConnected();
            if (address) {
            const contract = await connectingWithContract();
            const read = await contract.readMessage(friendAddress);
            setFriendMsg(read);
            }
        }catch (error){
            console.log("Currently You Have no Message");
        }
    };

    //Create Account
    const createAccount = async({name})=>{
        try{
            if(!name||!account)
                return setError("Name And AccountAddress, cannot be emty");

            const contract = await connectingWithContract();
            const getCreatedUser = await contract.createAccount(name);
            setLoading(true);
            await getCreatedUser.wait();
            setLoading(false);
            window.location.reload();
        }catch (error){
            setError("Error while creating your account Please reload brower")
        }
    }

    //Add your Friends
    const addFriends = async ({name, accountAddress}) =>{
        try{
            if(!name||!accountAddress) return setError("Please provide dadta");

            const contract = await connectingWithContract();
            const addMyFriend = await contract.addFriend(accountAddress, name);
            setLoading(true);
            await addMyFriend.wait();
            setLoading(false);
            router.push("/");
            window.location.reload();
        } catch(error){
            setError("Something went wrong while adding friends, try again");
        }
    }
    //Send Message to your Friend
    const sendMessage = async({msg, address})=>{
        try{
            if(!msg||!address)return setError("Please Type Your Message");
            const contract = await connectingWithContract();
            const addMessage = await contract.sendMessage(address,msg);
            setLoading(true);
            await addMessage.wait();
            setLoading(false);
            window.location.reload();
        }catch(error){
            setError("Please reload and try again");
        }
    };

    //Read Info
    const readUser = async(userAddress)=>{
        const contract = await connectingWithContract();
        const userName = await contract.getUsername(userAddress);
        setCurrentUserName(userName);
        setCurrentUserAddress(userAddress);
    }
    return (
        <ChatAppContect.Provider 
        value={{
            readMessage, 
            createAccount, 
            addFriends, 
            sendMessage, 
            readUser,
            connectWallet,
            connectingWithContract,
            account,
            userName,
            friendLists,
            friendMsg,
            userLists,
            loading,
            error,
            currentUserName,
            currentUserAddress,}}>
            {children}
        </ChatAppContect.Provider>
    );
};