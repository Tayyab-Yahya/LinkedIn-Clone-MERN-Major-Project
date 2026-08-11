import Connection from "../models/connection.model.js"
import User from "../models/user.model.js"
import { io, userSocketMap } from "../index.js"

export const sendConnection = async (req, res) => {
    try {
        let {id} = req.params
        let sender = req.userId
        let user = await User.findById(sender)

        if(id==sender){
            return res.status(400).json({message: "You cannot send connection request to yourself!"})
        }

        if(user.useConnection.includes(id)){
            return res.status(400).json({message: "You're already connected!"})
        }

        let existingConnection = await Connection.findOne({
            sender, receiver: id, status: "pending"
        })

        if(existingConnection){
            return res.status(400).json({message: "Request already exists."})
        }

        let newRequest = await Connection.create({
            sender, receiver: id
        })

        let receiverSocketId = userSocketMap.get(id);
        let senderSocketId = userSocketMap.get(sender);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("statusUpdate", {
                updatedUserId: sender,
                newStatus: "received",
            });
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", {
                updatedUserId: id,
                newStatus: "pending",
            });
        }

        return res.status(200).json(newRequest)

    } catch (error) {
        return res.status(500).json({message: `sendConnection Error: ${error}`})
    }
}

export const acceptConnection = async (req, res) => {
    try {
        let {connectionId} = req.params
        let connection = await Connection.findById(connectionId)

        if(!connection){
            return res.status(404).json({message: "Connection does not exists!"})
        }
        if(connection.status != "pending"){
            return res.status(400).json({message: "Request under process."})
        }

        connection.status = "accepted"
        await connection.save()

        await User.findByIdAndUpdate(req.userId, {
            $addToSet: {connection: connection.sender._id}
        })
        await User.findByIdAndUpdate(connection.sender._id, {
            $addToSet: {connection: req.userId}
        })

        let receiverSocketId = userSocketMap.get(connection.receiver._id);
        let senderSocketId = userSocketMap.get(connection.sender._id);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("statusUpdate", {
                updatedUserId: connection.sender._id,
                newStatus: "disconnect",
            });
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", {
                updatedUserId: req.userId,
                newStatus: "disconnect",
            });
        }

        return res.status(200).json({message: "Connection Accepted"})

    } catch (error) {
        return res.status(500).json({message: "acceptConnection Error: ", error})
    }
}

export const rejectConnection = async (req, res) => {
    try {
        let {connectionId} = req.params
        let connection = await Connection.findById(connectionId)

        if(!connection){
            return res.status(404).json({message: "Connection does not exists!"})
        }
        if(connection.status != "pending"){
            return res.status(400).json({message: "Request under process."})
        }

        connection.status = "rejected"
        await connection.save()

        return res.status(200).json({message: "Connection Rejected"})

    } catch (error) {
        return res.status(500).json({message: "rejectConnection Error: ", error})
    }
}

export const getConnectionStatus = async (req, res) => {
    
    try {
        const targetUserId = req.params.userId
        const currentUserId = req.userId

        let currentUser = await User.findById(currentUserId)

        if( currentUser.connection.includes(targetUserId) ){
            return res.json({status: "disconnect"})
        }
        
        const pendingRequest = await Connection.findOne({
            $or: [
                { sender: currentUserId, receiver: targetUserId },
                { sender: targetUserId, receiver: currentUserId }
            ],
            status: "pending",
        });

        if(pendingRequest){
            if(pendingRequest.sender.toString() === currentUserId.toString()){
                return res.json({status: "pending"})
            } else {
                return res.json({status: "received", requestId: pendingRequest._id})
            }
        }

        // If no connection or pending req found
        return res.json({status: "Connect"})

    } catch (error) {
        return res.status(500).json({message: "getConnectionStatus Error: ", error})
    }
}

export const removeConnection = async (req, res) => {
    try {
        const myId = req.userId;
        const otherUserId = req.params.userId;

        await User.findByIdAndUpdate(myId, {
            $pull: { connection: otherUserId }
        })
        await User.findByIdAndUpdate(otherUserId, {
            $pull: { connection: myId }
        })

        let receiverSocketId = userSocketMap.get(otherUserId);
        let senderSocketId = userSocketMap.get(myId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("statusUpdate", {
                updatedUserId: myId,
                newStatus: "connect",
            });
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("statusUpdate", {
                updatedUserId: otherUserId,
                newStatus: "connect",
            });
        }

        return res.json({message: "Connection removed successfully"})

    } catch (error) {
        return res.status(500).json({message: "removeConnection Error"})
    }
}

export const getConnectionRequests = async (req, res) => {
    try {
        const userId = req.userId

        const requests = await Connection
        .find({ receiver: userId, status: "pending" })
        .populate("sender", "firstName lastName userName email profileImage headline")

        return res.status(200).json(requests)

    } catch (error) {
        console.error("Error in getConnectionRequests controller: ", error)
        return res.status(500).json({message: "getConnectionRequests Error"})
    }
}

export const getUserConnections = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate("connection", "firstName lastName userName profileImage headline connection")

        return res.status.json(user.connection)

    } catch (error) {
        console.error("Error in getUserConnections controller: ", error)
        return res.status(500).json({message: "getUserConnections Error"})
    }
}