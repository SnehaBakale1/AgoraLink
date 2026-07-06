import React, { useEffect, useState } from "react";
import CreateWorkspace from "../components/CreateWorkspace";
import Workspace from "../components/Workspace";
import {
  Box,
  Heading,
  SimpleGrid
} from "@chakra-ui/react";


const Dashboard = () => {

const [workspaces,setWorkspaces]=useState([]);


const fetchWorkspace = async()=>{

const token = localStorage.getItem("token");


const res = await fetch(
"https://agoralink-backend.onrender.com/api/workspace",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);


const data = await res.json();


if(Array.isArray(data)){
setWorkspaces(data);
}

};


useEffect(()=>{
fetchWorkspace();
},[]);



return (

<Box
minH="100vh"
bg="gray.100"
p="40px"
>


<Heading mb="30px">
🚀 My Workspaces
</Heading>


<CreateWorkspace
fetchWorkspace={fetchWorkspace}
/>


<SimpleGrid
columns={[1,2,3]}
spacing={6}
mt="30px"
>

{
workspaces.map((work)=>(

<Workspace
key={work._id}
workspace={work}
/>

))

}

</SimpleGrid>


</Box>

)

}


export default Dashboard;