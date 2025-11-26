const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get chat history with a specific user
// @route   GET /api/chat/:userId
// @access  Private
const getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get list of conversations (users chatted with)
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Find all messages where current user is sender or receiver
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }]
        }).sort({ createdAt: -1 });

        // Extract unique user IDs
        const userIds = new Set();
        messages.forEach(msg => {
            if (msg.sender.toString() !== currentUserId.toString()) userIds.add(msg.sender.toString());
            if (msg.receiver.toString() !== currentUserId.toString()) userIds.add(msg.receiver.toString());
        });

        // Fetch user details
        const users = await User.find({ _id: { $in: Array.from(userIds) } }).select('name email role profilePicture');

        // Map users to include last message (optional optimization)
        const conversations = users.map(user => {
            const lastMsg = messages.find(m =>
                (m.sender.toString() === user._id.toString() && m.receiver.toString() === currentUserId.toString()) ||
                (m.sender.toString() === currentUserId.toString() && m.receiver.toString() === user._id.toString())
            );
            return {
                ...user.toObject(),
                lastMessage: lastMsg ? lastMsg.content : '',
                lastMessageTime: lastMsg ? lastMsg.createdAt : null
            };
        });

        // Sort by last message time
        conversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

        res.json(conversations);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getChatHistory,
    getConversations
};
