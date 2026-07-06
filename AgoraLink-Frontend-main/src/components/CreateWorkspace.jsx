import React,{useState} from "react";
import {
Input,
Button,
HStack
} from "@chakra-ui/react";


const CreateWorkspace = ({fetchWorkspace})=>{


const [name,setName]=useState("");


const create = async()=>{


if(!name.trim()){
alert("Enter workspace name");
return;
}


const token =
localStorage.getItem("token");


await fetch(
"https://agoralink-backend.onrender.com/api/workspace/create",
{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},

body:JSON.stringify({
workspaceName:name
})

});


setName("");

fetchWorkspace();

};


return (

<HStack>

<Input

placeholder="Enter workspace name"

bg="white"

value={name}

onChange={(e)=>setName(e.target.value)}

/>


<Button
colorScheme="purple"
onClick={create}
>

Create +

</Button>


</HStack>

)

}


export default CreateWorkspace;