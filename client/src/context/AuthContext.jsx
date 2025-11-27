import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated and if so, set the user data and connect the socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/users/is-auth", {
        withCredentials: true,
      });
      setUser(data.data.user);
      connectSocket(data.data.user);
    } catch (error) {
      if (error?.response?.status === 401) {
        setUser(null);
        return;
      } 
      // toast.error(error.message);
      console.log(error);
    } 
  };

  //  Login/signup and socket connection
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/users/${state}`, credentials, {
        withCredentials: true,
      });
      setUser(data.data.user);
      connectSocket(data.data.user);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  //   Logout function and socket disconnection
  const logout = async () => {
    try {
      const { data } = await axios.get("/api/users/logout", {
        withCredentials: true,
      });
      toast.success(data.message);
      setUser(null);
      setOnlineUsers([]);
      socket?.disconnect();
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  //   Update Profile
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/users/update-profile", body, {
        withCredentials: true,
      });
      setUser(data.data.user);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  //   Connect socket function to handle socket connection and online user updates
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) {
      return;
    }
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    axios,
    user,
    onlineUsers,
    socket,
    navigate,
    login,
    logout,
    updateProfile,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
