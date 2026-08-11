import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const uploadOnCloudinary = async (filePath) => {
    
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        if(!filePath){
            return null
        }
        let uploadResult = await cloudinary.uploader.upload(filePath, {folder: "LinkedIn"})
        fs.unlinkSync(filePath) // Delete the file from local storage after uploading to Cloudinary
        return uploadResult.secure_url;

    } catch (error) {
        fs.unlinkSync(filePath)
        console.log(error)
        return null;
    }
}
export default uploadOnCloudinary