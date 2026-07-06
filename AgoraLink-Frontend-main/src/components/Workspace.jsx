import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

import {
Box,
Heading,
Text,
Badge,
Button,
Input,
VStack,
useToast
} from "@chakra-ui/react";



const Workspace = ({workspace})=>{


const navigate = useNavigate();

const toast = useToast();

const [email,setEmail] =
useState("");




// OPEN CHAT

const openChat=()=>{


localStorage.setItem(
"workspaceId",
workspace._id
);


navigate("/chat");


};






// ADD MEMBER

const addMember =
async(e)=>{


e.stopPropagation();


try{


const userInfo =
JSON.parse(
localStorage.getItem("userInfo")
);


await axios.put(

`https://agoralink-backend.onrender.com/workspace/add-member/${workspace._id}`,

{
email:email
},

{

headers:{

Authorization:
`Bearer ${userInfo.token}`

}

}

);



toast({

title:"Member Added",

status:"success",

duration:3000,

isClosable:true

});


setEmail("");



}

catch(error){


toast({

title:"Error",

description:
error.response?.data?.message,

status:"error",

duration:3000,

isClosable:true

});


}



};








return (


<Box

bg="white"

p="25px"

borderRadius="20px"

boxShadow="lg"

transition="0.3s"

_hover={{
transform:"scale(1.05)"
}}

>


<Box

cursor="pointer"

onClick={openChat}

>


<Heading size="md">

💬 {workspace.workspaceName}

</Heading>



<Text mt="15px">

Members :

<Badge

ml="2"

colorScheme="green"

>

{workspace.members.length}

</Badge>


</Text>


</Box>







<VStack mt="20px">


<Input

placeholder="Enter member email"

value={email}

onChange={(e)=>
setEmail(e.target.value)
}

onClick={(e)=>
e.stopPropagation()
}

/>




<Button

colorScheme="purple"

w="100%"

onClick={addMember}

>

Add Member +

</Button>



</VStack>



</Box>


)


}



export default Workspace;