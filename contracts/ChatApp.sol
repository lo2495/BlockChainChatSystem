pragma solidity >=0.7.0 <0.9.0;

contract ChatApp{

    struct user{
        string name;
        friend[] friendList;
    }

    struct friend{
        address pubkey;
        string name;
    }

    struct message{
        address sender;
        uint256 timestamp;
        string msg;
    }

    struct AllUserStruck{
        string name;
        address accountAddress;
    }

    AllUserStruck[] getAllUsers;

    mapping(address => user) userList;
    mapping(bytes32 => message[])allMessages;

    //Check User Exist
    function checkUserExists(address pubkey) public view returns(bool){
        return bytes(userList[pubkey].name).length>0;
    }

    //Create Account
    function createAccount(string calldata name)external{
        require(checkUserExists(msg.sender)==false,"User already exists");
        require(bytes(name).length>0,"Username cannot be empty");

        userList[msg.sender].name = name;

        getAllUsers.push(AllUserStruck(name, msg.sender));
    }

    //Get Username
    function getUsername(address pubkey) external view returns(string memory){
        require(checkUserExists(pubkey),"User is not registered");
        return userList[pubkey].name;
    }

    //Add Friends
    function addFriend(address friend_key, string calldata name) external{
        require(checkUserExists(msg.sender),"Create an account first");
        require(checkUserExists(friend_key),"User is not registered!");
        require(msg.sender != friend_key, "Users cannot add themeselves as friends");
        require(checkAlreadyFriends(msg.sender, friend_key)==false,"These users are already friends");
        _addFriend(msg.sender, friend_key, name);
        _addFriend(friend_key, msg.sender, userList[msg.sender].name);
    }

    //checkAlreadyFriends
    function checkAlreadyFriends(address pubkey1, address pubkey2) internal view returns(bool){
        if(userList[pubkey1].friendList.length > userList[pubkey2].friendList.length){
            address tmp = pubkey1;
            pubkey1 = pubkey2;
            pubkey2 = tmp;
        }
        for (uint256 i = 0; i < userList[pubkey1].friendList.length;i++){
            if(userList[pubkey1].friendList[i].pubkey == pubkey2) return true;
        }
        return false;
    }

    function _addFriend(address me, address friend_key, string memory name) internal{
        friend memory newFriend = friend(friend_key, name);
        userList[me].friendList.push(newFriend);
    }

    //Get My Friend
    function getMyFriendList() external view returns(friend[] memory){
        return userList[msg.sender].friendList;
    }

    //Get Chat Code
    function _getChatCode(address pubkey1, address pubkey2) internal pure returns(bytes32){
        if (pubkey1 < pubkey2){
            return keccak256(abi.encodePacked(pubkey1, pubkey2));
        } else return keccak256(abi.encodePacked(pubkey2,pubkey1));
    }

    //Send Message
    function sendMessage(address friend_key, string calldata _msg) external{
        require(checkUserExists(msg.sender),"Create an acoount first");
        require(checkUserExists(friend_key),"User is not registered");
        require(checkAlreadyFriends(msg.sender, friend_key),"You are not friend with the given user");
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        message memory newMsg = message(msg.sender, block.timestamp, _msg);
        allMessages[chatCode].push(newMsg);
    }

    //Read Message
    function readMessage(address friend_key) external view returns(message[] memory){
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        return allMessages[chatCode];
    }

    function getAllAppUser() public view returns(AllUserStruck[] memory){
        return getAllUsers;
    }
}