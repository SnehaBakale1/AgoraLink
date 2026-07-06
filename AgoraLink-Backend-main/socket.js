const socketIo = (io) => {

  // store connected users
  const connectedUsers = new Map();


  // new socket connection
  io.on("connection", (socket) => {


    // get user and workspace from frontend
    const user = socket.handshake.auth.user;

    const workspaceId =
      socket.handshake.auth.workspaceId;


    console.log(
      "User connected:",
      user?.username
    );


    // JOIN WORKSPACE ROOM
    if (workspaceId) {

      socket.join(workspaceId);


      connectedUsers.set(
        socket.id,
        {
          user,
          room: workspaceId
        }
      );


      console.log(
        `${user?.username} joined workspace ${workspaceId}`
      );

    }




    // JOIN GROUP ROOM

    socket.on(
      "join room",
      (groupId) => {


        socket.join(groupId);


        connectedUsers.set(
          socket.id,
          {
            user,
            room: groupId
          }
        );


        const usersInRoom =
          Array.from(
            connectedUsers.values()
          )
          .filter(
            (u)=>u.room === groupId
          )
          .map(
            (u)=>u.user
          );


        io.in(groupId).emit(
          "users in room",
          usersInRoom
        );


        socket
        .to(groupId)
        .emit(
          "notification",
          {
            type:"USER_JOINED",
            message:
            `${user?.username} has joined`,
            user:user
          }
        );

      }
    );






    // LEAVE ROOM

    socket.on(
      "leave room",
      (groupId)=>{


        socket.leave(groupId);


        if(
          connectedUsers.has(socket.id)
        ){

          connectedUsers.delete(
            socket.id
          );


          socket
          .to(groupId)
          .emit(
            "user left",
            user?._id
          );

        }

      }
    );







    // SEND MESSAGE

    socket.on(
      "new message",
      (message)=>{


        const roomId =
        message.workspaceId 
        || message.groupId;



        socket
        .to(roomId)
        .emit(
          "message received",
          message
        );


      }
    );








    // TYPING START

    socket.on(
      "typing",
      ({groupId, username})=>{


        socket
        .to(groupId)
        .emit(
          "user typing",
          {
            username
          }
        );


      }
    );





    // TYPING STOP

    socket.on(
      "stop typing",
      ({groupId})=>{


        socket
        .to(groupId)
        .emit(
          "user stop typing",
          {
            username:user?.username
          }
        );


      }
    );







    // DISCONNECT

    socket.on(
      "disconnect",
      ()=>{


        console.log(
          `${user?.username} disconnected`
        );


        if(
          connectedUsers.has(socket.id)
        ){


          const userData =
          connectedUsers.get(socket.id);



          socket
          .to(userData.room)
          .emit(
            "user left",
            user?._id
          );



          connectedUsers.delete(
            socket.id
          );


        }


      }
    );



  });

};


module.exports = socketIo;