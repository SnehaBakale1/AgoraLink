import {
  Box,
  VStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Flex,
  Icon,
  Badge,
  Tooltip,
} from "@chakra-ui/react";

import axios from "axios";
import { useEffect, useState } from "react";
import { FiLogOut, FiPlus, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


const Sidebar = ({ setSelectedGroup }) => {


const { isOpen,onOpen,onClose } =
useDisclosure();


const [newGroupName,setNewGroupName] =
useState("");

const [groups,setGroups] =
useState([]);

const [userGroups,setUserGroups] =
useState([]);

const [newGroupDescription,setNewGroupDescription] =
useState("");


const toast = useToast();

const navigate = useNavigate();



useEffect(()=>{

fetchGroups();

},[]);





// FETCH GROUPS

const fetchGroups = async()=>{


try{


const userInfo =
JSON.parse(
localStorage.getItem("userInfo")
);


const token =
userInfo.token;


const workspaceId =
localStorage.getItem("workspaceId");



const {data} =
await axios.get(

`https://agoralink-backend.onrender.com/api/groups?workspaceId=${workspaceId}`,

{

headers:{

Authorization:`Bearer ${token}`

}

}

);



setGroups(data);



const joined =
data
.filter((g)=>

g.members.some(

(m)=>m._id === userInfo._id

)

)

.map((g)=>g._id);



setUserGroups(joined);



}

catch(error){

console.log(error);

}


};







// CREATE GROUP


const handleCreateGroup =
async()=>{


try{


const userInfo =
JSON.parse(
localStorage.getItem("userInfo")
);


const token =
userInfo.token;


const workspaceId =
localStorage.getItem("workspaceId");



await axios.post(

"https://agoralink-backend.onrender.com/api/groups",

{

name:newGroupName,

description:newGroupDescription,

workspaceId:workspaceId

},

{

headers:{

Authorization:`Bearer ${token}`

}

}

);




toast({

title:"Group Created",

status:"success",

duration:3000,

isClosable:true

});



setNewGroupName("");

setNewGroupDescription("");


onClose();


fetchGroups();



}

catch(error){


toast({

title:"Error",

description:
error?.response?.data?.message,

status:"error",

duration:3000,

isClosable:true

});


}



};








// JOIN GROUP

const handleJoinGroup =
async(groupId)=>{


const userInfo =
JSON.parse(
localStorage.getItem("userInfo")
);


const token =
userInfo.token;



await axios.post(

`https://agoralink-backend.onrender.com/api/groups/${groupId}/join`,

{},

{

headers:{

Authorization:`Bearer ${token}`

}

}

);



fetchGroups();


};









// LEAVE GROUP

const handleLeaveGroup =
async(groupId)=>{


const userInfo =
JSON.parse(
localStorage.getItem("userInfo")
);


const token =
userInfo.token;



await axios.post(

`https://agoralink-backend.onrender.com/api/groups/${groupId}/leave`,

{},

{

headers:{

Authorization:`Bearer ${token}`

}

}

);


fetchGroups();

setSelectedGroup(null);


};









// LOGOUT

const handleLogOut = ()=>{

localStorage.clear();

navigate("/login");

};








return(

<Box
h="100%"
bg="white"
width="300px"
display="flex"
flexDirection="column"
>



<Flex
p={4}
justify="space-between"
align="center"
borderBottom="1px solid #ddd"
>


<Flex align="center">

<Icon
as={FiUsers}
fontSize="24px"
color="blue.500"
mr={2}
/>


<Text
fontSize="xl"
fontWeight="bold"
>

Groups

</Text>


</Flex>





<Tooltip label="Create Group">


<Button

onClick={onOpen}

colorScheme="blue"

borderRadius="full"

>

<FiPlus/>

</Button>


</Tooltip>


</Flex>









<Box
flex="1"
overflowY="auto"
p={4}
>


<VStack spacing={3}>


{

groups.map((group)=>(


<Box

key={group._id}

p={4}

w="100%"

borderRadius="lg"

bg="gray.50"

boxShadow="md"

>


<Text
fontWeight="bold"
onClick={()=>setSelectedGroup(group)}
cursor="pointer"
>

{group.name}

</Text>



<Text fontSize="sm">

{group.description}

</Text>




<Button

mt={2}

size="sm"

colorScheme={
userGroups.includes(group._id)
?"red":"blue"
}


onClick={()=>{

userGroups.includes(group._id)
?
handleLeaveGroup(group._id)
:
handleJoinGroup(group._id)

}}

>


{
userGroups.includes(group._id)
?
"Leave"
:
"Join"
}


</Button>



</Box>


))

}


</VStack>


</Box>








<Button

m={4}

colorScheme="red"

leftIcon={<FiLogOut/>}

onClick={handleLogOut}

>

Logout

</Button>









<Modal
isOpen={isOpen}
onClose={onClose}
>


<ModalOverlay/>


<ModalContent>


<ModalHeader>

Create Group

</ModalHeader>


<ModalCloseButton/>


<ModalBody>


<FormControl>

<FormLabel>

Group Name

</FormLabel>


<Input

value={newGroupName}

onChange={
(e)=>setNewGroupName(e.target.value)
}

/>

</FormControl>





<FormControl mt={4}>


<FormLabel>

Description

</FormLabel>


<Input

value={newGroupDescription}

onChange={
(e)=>setNewGroupDescription(e.target.value)
}

/>


</FormControl>





<Button

mt={4}

mb={4}

w="100%"

colorScheme="blue"

onClick={handleCreateGroup}

>

Create

</Button>


</ModalBody>


</ModalContent>


</Modal>



</Box>


);


};



export default Sidebar;