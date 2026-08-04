let io;


function setSocket(socketInstance){

    io = socketInstance;

}



function getSocket(){

    return io;

}



module.exports = {
    setSocket,
    getSocket
};