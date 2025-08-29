import fs from "fs";
import path from "path";

import Resume from "../models/resumeModel.js";
import upload from '../middleware/uploadMiddleware.js';

export const uploadResumeImages = async (req, res) => { 
    try{
        //configure multer to handle images
        upload.fields([{name:'thumbnail'},{name:"profileImage"}])
        (req,res, async (err) => {
            if(err){
                return res.status(400).json({ message:"file upload failed", error:err.message });
            }
            const resumeId= req.params.id;
            const resume= await Resume.findOne({_id:resumeId,userId:req.user.id});

            if(!resume){
                return res.status(404).json({ message: "Resume not found" });
            }
            //use process cwd to locate uploads folder
            const uploadsFolder = path.join(process.cwd(), 'uploads');
            const baseUrl = `${req.protocol}://${req.get('host')}`;

            const newThumbnail = req.files.thumbnail?.[0];
            const newProfileImage = req.files.profileImage?.[0];

            if(newThumbnail){
                if(resume.thumbnailLink){
                    const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
                    if(fs.existsSync(oldThumbnail)){
                        fs.unlinkSync(oldThumbnail);
                    }
                }
                resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
            }
            //same for profilepreview image
            if(newProfileImage){
                if(resume.profileInfo?.profilepreviewUrl){
                    const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilepreviewUrl));
                    if(fs.existsSync(oldProfile)){
                        fs.unlinkSync(oldProfile);
                    }
                }
                resume.profileInfo.profilepreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
            }

            await resume.save();
            res.status(200).json({ 
                message: "Images uploaded successfully", 
                thumbnail: resume.thumbnailLink,
                profilePreview: resume.profileInfo.profilepreviewUrl
            });
        });
    }
    catch(err){
        console.error('error uploading images:', err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}
        