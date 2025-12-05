import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from "socket.io"
import http from "http";


const app = express();
export const server = http.createServer(app)
const port = process.env.PORT || 4000;

// CORS Configuration Logic
const rawOrigins = process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = rawOrigins
  .split(',')
  .map((o) => o.trim().replace(/^['"]|['"]$/g, '')) // Remove quotes if present
  .filter(Boolean);

const allowAll = allowedOrigins.includes('*');

const corsOriginCheck = (origin, callback) => {
  // allow requests with no origin (like curl, Postman, server-to-server)
  if (!origin) return callback(null, true);

  if (allowAll || allowedOrigins.includes(origin)) {
    return callback(null, true);
  } else {
    return callback(
      new Error(`CORS error: Origin ${origin} not allowed by CORS`),
      false
    );
  }
};

// Initialize socket.io server
export const io = new Server(server, {
  cors: {
    origin: corsOriginCheck,
    methods: ['GET', 'POST'],
    credentials: true
  },
  credentials: true
})

// Store online users
export const userSocketMap = {} //userId:socketId

// Socket io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId
  console.log("User Connected", userId);
  if (userId) {
    userSocketMap[userId] = socket.id
  }
  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })
})



app.set('trust proxy', 1);

// basic configurations
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));
app.use(cookieParser());

// cors configurations
app.use(
  cors({
    origin: corsOriginCheck,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Origin', 'Accept', 'X-Requested-With'],
    optionsSuccessStatus: 204,
  })
);


// user routes
import userRouter from './routes/user.routes.js';
app.use('/api/users', userRouter)

// message routes
import messageRouter from './routes/message.routes.js';
app.use('/api/messages', messageRouter)

app.get('/', (req, res) => {
  res.send('Home');
});

export default app;