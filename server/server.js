require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");

const http = require("http");
const { Server } = require("socket.io");

const { setSocket } = require("./utils/socket");



const app = express();



// ===============================
// MIDDLEWARE
// ===============================


app.use(
  cors({
    origin: "https://queueit-vert.vercel.app",
    credentials: true
  })
);


app.use(
  express.json()
);




// ===============================
// SESSION
// ===============================


app.use(
  session({

    secret:process.env.JWT_SECRET,

    resave:false,

    saveUninitialized:false,

    cookie:{
      secure:false
    }

  })
);



app.use(
  passport.initialize()
);




// ===============================
// DATABASE
// ===============================


mongoose.connect(
  process.env.MONGO_URI
)
.then(()=>{

console.log(
"MongoDB connected"
);

})
.catch((err)=>{

console.log(
"MongoDB Error:",
err.message
);

});





// ===============================
// SOCKET.IO SETUP
// ===============================


const server = http.createServer(app);



const io = new Server(
  server,
  {
    cors: {
      origin: "https://queueit-vert.vercel.app",
      methods: ["GET", "POST"],
      credentials: true
    }
  }
);




// make socket available
setSocket(io);



io.on(
"connection",
(socket)=>{


console.log(
"Socket connected:",
socket.id
);



socket.on(
"joinQueueRoom",
(queueId)=>{


socket.join(
queueId.toString()
);


console.log(
"Joined Queue Room:",
queueId
);


});




socket.on(
"disconnect",
()=>{


console.log(
"Socket disconnected:",
socket.id
);


});


}

);

// ===============================
// ROUTES
// ===============================



app.get(
"/",
(req,res)=>{


res.send(
"QueueIt API is running"
);


});

app.use(
"/auth",
require("./routes/authRoutes")
);

app.use(
"/api/queues",
require("./routes/queueRoutes")
);




app.use(
"/api/venues",
require("./routes/venueRoutes")
);




app.use(
"/api/admin",
require("./routes/adminRoutes")
);




app.use(
"/api/stats",
require("./routes/statsRoutes")
);




app.use(
"/api/notifications",
require("./routes/NotificationRoutes")
);




app.use(
"/api/setup",
require("./routes/adminSetupRoutes")
);







// ===============================
// SERVER START
// ===============================


const PORT =
process.env.PORT || 5000;



server.listen(
PORT,
()=>{


console.log(
`Server running on port ${PORT}`
);


}
);