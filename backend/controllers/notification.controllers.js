import Notification from "../models/notification.model.js"

export const getNotifications = async (req, res) => {
    try {
        let notification = await Notification.find({receiver: req.userId})
            .populate("relatedUser", "firstName lastName profileImage userName")
            .populate("relatedPost", "image description")
            .sort({createdAt: -1})
        return res.status(200).json(notification)
    } catch (error) {
        return res.status(500).json({message: "getNotification Error: ", error})
    }
}

export const deleteNotification = async (req, res) => {
    try {
        let {id} = req.params
        await Notification.findOneAndDelete({
            _id: id,
            receiver: req.userId,
        })
        return res.status(200).json({message: "notification deleted successfully."})
    } catch (error) {
        return res.status(500).json({message: "deleteNotification Error: ", error})
    }
}

export const clearAllNotification = async (req, res) => {
    try {
        let {id} = req.params
        await Notification.deleteMany({
            receiver: req.userId,
        })
        return res.status(200).json({message: "All notifications deleted successfully."})
    } catch (error) {
        return res.status(500).json({message: "clearAllNotifications Error: ", error})
    }
}