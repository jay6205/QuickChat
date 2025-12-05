# QuickChat 💬

A modern, real-time chat application built with the MERN stack, featuring real-time messaging, online status indicators, and a responsive user interface.

Working Link: https://quick-chat-cmp7hdvck-dhananjaybalekar-gmailcoms-projects.vercel.app/

## ✨ Features

- **Real-time Messaging**: Instant message delivery using Socket.io
- **Online Status Indicators**: See who's online in real-time
- **User Authentication**: Secure JWT-based authentication with HTTP-only cookies
- **Image Sharing**: Upload and share images in conversations using Cloudinary
- **Message Status**: Track unseen message counts and mark messages as seen
- **Profile Management**: Update user profiles with custom profile pictures
- **Protected Routes**: Secure routing with authentication middleware
- **Responsive Design**: Beautiful UI built with React and Tailwind CSS

## 🚀 Tech Stack

### Frontend
- **React** (v19.2.0) - UI library
- **React Router DOM** (v7.9.6) - Client-side routing
- **Axios** (v1.13.2) - HTTP client
- **Socket.io Client** (v4.8.1) - Real-time communication
- **Tailwind CSS** (v4.1.17) - Utility-first CSS framework
- **React Hot Toast** (v2.6.0) - Toast notifications
- **Vite** (v7.2.4) - Build tool and dev server

### Backend
- **Node.js** with **Express** (v5.1.0) - Server framework
- **MongoDB** with **Mongoose** (v9.0.0) - Database
- **Socket.io** (v4.8.1) - WebSocket server
- **JWT** (v9.0.2) - Authentication
- **Bcrypt** (v6.0.0) - Password hashing
- **Cloudinary** (v2.8.0) - Image storage
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - HTTP cookie parsing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas cloud database)
- **Cloudinary Account** (for image uploads)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd "Chat app"
```

### 2. Install server dependencies
```bash
cd server
npm install
```

### 3. Install client dependencies
```bash
cd ../client
npm install
```

### 4. Environment Variables

Create a `.env` file in the `server` directory:

```env
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=8000
CORS_ORIGIN=http://localhost:5173

# Node Environment
NODE_ENV=development
```

Create a `.env` file in the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:8000
```

## 🏃 Running the Application

### Development Mode

**Start the server:**
```bash
cd server
npm run server
```
The server will start on `http://localhost:8000` with nodemon for auto-restart.

**Start the client:**
```bash
cd client
npm run dev
```
The client will start on `http://localhost:5173`.

### Production Mode

**Build the client:**
```bash
cd client
npm run build
```

**Start the server:**
```bash
cd server
npm start
```

## 📁 Project Structure

```
Chat app/
├── client/                  # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── assets/         # Images and static assets
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context (AuthContext)
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx    # Main chat interface
│   │   │   ├── Login.jsx   # Authentication page
│   │   │   └── Profile.jsx # User profile page
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   └── package.json
│
├── server/                  # Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   │   ├── message.controllers.js
│   │   │   └── user.controllers.js 
│   │   ├── db/             # Database configuration
│   │   ├── middlewares/    # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   │   ├── message.models.js
│   │   │   └── user.models.js
│   │   ├── routes/         # API routes
│   │   │   ├── message.routes.js
│   │   │   └── user.routes.js
│   │   ├── utils/          # Utility functions
│   │   │   ├── api-error.js
│   │   │   ├── api-response.js
│   │   │   ├── async-handler.js
│   │   │   └── cloudinary.js
│   │   ├── index.js        # Server entry point
│   │   └── server.js       # Express app & Socket.io setup
│   └── package.json
│
└── README.md
```

## 🔑 API Endpoints

### User Routes (`/api/users`)
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/logout` - User logout
- `GET /api/users/is-auth` - Check authentication status
- `PUT /api/users/update-profile` - Update user profile

### Message Routes (`/api/messages`)
- `GET /api/messages/users` - Get all users for sidebar with unseen message counts
- `GET /api/messages/:id` - Get messages with a specific user
- `POST /api/messages/send/:id` - Send a message to a user
- `PUT /api/messages/mark/:id` - Mark message as seen

## 🔌 WebSocket Events

### Client → Server
- Connection with `userId` query parameter

### Server → Client
- `getOnlineUsers` - Broadcast list of online user IDs
- `newMessage` - Send new message to receiver

## 🎨 Features in Detail

### Real-time Messaging
- Messages are delivered instantly using Socket.io
- Online/offline status is tracked and broadcasted
- Message delivery is handled with socket rooms

### Authentication System
- JWT tokens stored in HTTP-only cookies for security
- Password hashing using bcrypt
- Protected routes on both frontend and backend
- Automatic authentication check on app load

### Image Upload
- Images are uploaded to Cloudinary
- Images are displayed inline in chat messages
- Support for base64 encoding from frontend

### Unseen Messages
- Track unseen message counts per user
- Automatic marking as seen when viewing conversation
- Visual indicators for new messages

## 🔒 Security Features

- HTTP-only cookies for JWT tokens
- Password hashing with bcrypt
- CORS configuration for allowed origins
- Protected API routes with authentication middleware
- Environment variables for sensitive data


## 👤 Author

**Dhananjay**

## 🙏 Acknowledgments

- Socket.io for real-time communication
- Cloudinary for image hosting
- MongoDB for database
- React and Tailwind CSS for the beautiful UI

---

**Happy Chatting! 💬✨**
