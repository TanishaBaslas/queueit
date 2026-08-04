import {io} from "socket.io-client";
const socket = io(
"https://queueit-backend-oaib.onrender.com"
);
export default socket;