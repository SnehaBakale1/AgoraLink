import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Flex,
  Icon,
  Avatar,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";

import {
  FiSend,
  FiInfo,
  FiMessageCircle,
  FiPaperclip,
} from "react-icons/fi";

import UsersList from "./UsersList";
import { useEffect, useRef, useState } from "react";
import axios from "axios";


const ChatArea = ({ selectedGroup, socket }) => {


const [messages,setMessages] =
useState([]);


const [newMessage,setNewMessage] =
useState("");


const [file,setFile] =
useState(null);


const [connectedUsers,setConnectedUsers] =
useState([]);


const [isTyping,setIsTyping] =
useState(false);


const [typingUsers,setTypingUsers] =
useState(new Set());


const messagesEndRef =
useRef(null);


const typingTimeOutRef =
useRef(null);


const toast = useToast();


const currentUser =
JSON.parse(
localStorage.getItem("userInfo") || "{}"
);


const workspaceId =
localStorage.getItem("workspaceId");





const scrollToBottom=()=>{

messagesEndRef.current
?.scrollIntoView({
behavior:"smooth"
});

};



useEffect(()=>{

scrollToBottom();

},[messages,typingUsers]);








useEffect(()=>{


if(selectedGroup && socket){



const fetchMessages =
async()=>{


try{


const {data} =
await axios.get(

`http://localhost:5000/api/messages/${selectedGroup._id}?workspaceId=${workspaceId}`,

{
headers:{

Authorization:
`Bearer ${currentUser.token}`

}

}

);


setMessages(data);


}

catch(error){

console.log(error);

}

};



fetchMessages();


socket.emit(
"join room",
selectedGroup._id
);



socket.on(
"message received",
(message)=>{


setMessages(
(prev)=>[
...prev,
message
]
);


}

);



socket.on(
"users in room",
(users)=>{

setConnectedUsers(users);

}

);




socket.on(
"user typing",
({username})=>{

setTypingUsers(
(prev)=>
new Set([
...prev,
username
])
);

}

);



socket.on(
"user stop typing",
({username})=>{


setTypingUsers(prev=>{

const temp =
new Set(prev);

temp.delete(username);

return temp;

});


}

);





return ()=>{


socket.off("message received");

socket.off("users in room");

socket.off("user typing");

socket.off("user stop typing");


};


}


},[selectedGroup,socket]);
// SEND MESSAGE + FILE

const sendMessage = async()=>{


if(
!newMessage.trim()
&&
!file
)
return;



try{


const formData =
new FormData();



formData.append(
"content",
newMessage
);



formData.append(
"groupId",
selectedGroup._id
);



formData.append(
"workspaceId",
workspaceId
);



if(file){

formData.append(
"file",
file
);

}




const {data} =
await axios.post(

"http://localhost:5000/api/messages",

formData,

{

headers:{

Authorization:
`Bearer ${currentUser.token}`,

"Content-Type":
"multipart/form-data"

}

}

);




socket.emit(
"new message",
{

...data,

groupId:selectedGroup._id,

workspaceId

}

);




setMessages(
(prev)=>[
...prev,
data
]
);



setNewMessage("");

setFile(null);



}

catch(error){


toast({

title:"Message send failed",

status:"error",

duration:3000,

isClosable:true

});


}


};








// TYPING

const handleTyping=(e)=>{


setNewMessage(
e.target.value
);



if(!isTyping){

setIsTyping(true);


socket.emit(
"typing",
{
groupId:selectedGroup._id,
username:currentUser.username
}
);


}



clearTimeout(
typingTimeOutRef.current
);



typingTimeOutRef.current =
setTimeout(()=>{


socket.emit(
"stop typing",
{
groupId:selectedGroup._id,
username:currentUser.username
}
);


setIsTyping(false);


},2000);


};








return(


<Flex h="100%">



<Box
flex="1"
display="flex"
flexDirection="column"
bg="gray.50"
>



{
selectedGroup ? 
<>





{/* HEADER */}

<Flex
p={4}
bg="white"
borderBottom="1px solid #ddd"
align="center"
>


<Icon
as={FiMessageCircle}
mr={3}
/>


<Box>

<Text
fontWeight="bold"
fontSize="lg"
>

{selectedGroup.name}

</Text>


<Text fontSize="sm">

{selectedGroup.description}

</Text>


</Box>


</Flex>








{/* MESSAGES */}


<VStack
flex="1"
overflowY="auto"
p={5}
align="stretch"
>


{

messages.map(
(msg)=>(


<Box

key={msg._id}

alignSelf={
msg.sender._id
===
currentUser._id
?
"flex-end"
:
"flex-start"
}

bg={
msg.sender._id
===
currentUser._id
?
"blue.500"
:
"white"
}

color={
msg.sender._id
===
currentUser._id
?
"white"
:
"black"
}

p={3}

borderRadius="lg"

>


<Text
fontSize="xs"
>

{msg.sender.username}

</Text>



{
msg.content &&
<Text>

{msg.content}

</Text>

}




{
msg.file &&

<a

href={
`http://localhost:5000/${msg.file}`
}

target="_blank"

>

📎 Open File

</a>

}



</Box>


)

)

}


<div ref={messagesEndRef}/>


</VStack>









{/* INPUT */}


<Box
p={4}
bg="white"
>


<Flex gap={2}>


<Input

type="file"

display="none"

id="fileUpload"

onChange={
(e)=>
setFile(
e.target.files[0]
)
}

/>



<Button

as="label"

htmlFor="fileUpload"

>

<Icon as={FiPaperclip}/>

</Button>





<Input

placeholder="Type message..."

value={newMessage}

onChange={handleTyping}

onKeyDown={
(e)=>{

if(e.key==="Enter")
sendMessage();

}

}

/>



<Button

colorScheme="blue"

onClick={sendMessage}

>

<Icon as={FiSend}/>

</Button>



</Flex>



{
file &&

<Text fontSize="sm">

📎 {file.name}

</Text>

}


</Box>


</>

:


<Flex
h="100%"
align="center"
justify="center"
>

<Text>

Select group to chat

</Text>


</Flex>

}



</Box>





<Box width="260px">

{
selectedGroup &&
<UsersList
users={connectedUsers}
/>
}


</Box>



</Flex>


);


};



export default ChatArea;