import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import cloudinary from "../utils/cloudinary.js"
import { io, userSocketMap } from "../server.js";


// /api/messages/users
const getUsersForSideBar = asyncHandler(async (req, res) => {
    const userId = req.user._id
    if (!userId) {
        throw new ApiError(400, 'Bad Request');
    }
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password")

    const unseenMessagesCount = await Message.aggregate([
        {
            $match: {
                receiverId: userId,
                seen: false
            }
        },
        {
            $group: {
                _id: "$senderId", // Group by who sent the message
                count: { $sum: 1 }
            }
        }
    ]);

    // 3. Convert array to object for easy lookup: { 'senderId': 5, 'senderId2': 1 }
    const unseenMap = {};
    unseenMessagesCount.forEach(item => {
        unseenMap[item._id.toString()] = item.count;
    });

    // You can now return `unseenMap` directly or map it to users if you prefer structure
    return res.status(200).json(
        new ApiResponse(200, { users: filteredUsers, unseenMessages: unseenMap }, "Users Fetched Successfully")
    );
})


// /api/messages/:id
const getMessages = asyncHandler(async (req, res) => {
    const { id: selectedUserId } = req.params
    const myId = req.user._id
    if (!selectedUserId || !myId) {
        throw new ApiError(400, 'Bad Request', [id, myId]);
    }
    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: selectedUserId },
            { senderId: selectedUserId, receiverId: myId },
        ]
    })

    await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true })
    return res.status(200).json(
        new ApiResponse(200, { messages: messages }, "All the Messages Fetched Successfully")
    )

})

// /api/messages/mark/:id
const markMessageAsSeen = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError(400, 'Bad Request');
    }
    const updatedMessage = await Message.findByIdAndUpdate(
        id,
        { seen: true },
        { new: true }
    );
    return res.status(200).json(
        new ApiResponse(200, updatedMessage, "Message Marked As Seen")
    );
})

// /api/messages/send/:id
const sendMessage = asyncHandler(async (req, res) => {
    const { text, image } = req.body
    const receiverId = req.params.id
    const senderId = req.user._id
    if (!senderId) throw new ApiError(400, 'User not authenticated');
    if (!receiverId) throw new ApiError(400, 'Receiver ID is required');
    if (!text && !image) {
        throw new ApiError(400, 'Message must contain text or image');
    }
    let imageUrl=null;
    if (image) {
        const UploadResponse = await cloudinary.uploader.upload(image)
        imageUrl = UploadResponse.secure_url
    }
    const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        image: imageUrl,
    })

    // Emit the new message from the receivers socket
    const receiverSocketId = userSocketMap[receiverId]
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    return res.status(201).json(
        new ApiResponse(201, { message: newMessage }, "Message Sent Successfully")
    )
})


export { getUsersForSideBar, getMessages, markMessageAsSeen, sendMessage }