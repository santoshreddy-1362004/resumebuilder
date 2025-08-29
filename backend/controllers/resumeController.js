import Resume from "../models/resumeModel.js";
import fs from "fs";
import path from "path";

export const createResume= async(req,res)=>{
    try{
        const {title} =req.body;
           // Default template
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };
        const newResume= await Resume.create({
            userId: req.user._id,
            title,
            ...defaultResumeData,
            ...req.body
        });
        res.status(201).json(newResume);
    }
    catch(error){
        res.status(500).json({
            message: "failed to create resume error",
            error: error.message
        })
    }
}

export  const getUserResume= async(req,res)=>{
    try{
        const resumes=await Resume.find({userId: req.user._id}).sort({
            updatedAt: -1
        });
        res.status(200).json(resumes);
    }
    catch(error){
        res.status(500).json({
            message: "failed to get user resumes",
            error: error.message
        });
    }
}

export const getResumeById=async (req,res)=>{
    try{
        const resume =await Resume.findOne({_id: req.params.id, userId: req.user._id});
        if(!resume){
            return res.status(404).json({message: "Resume not found"});
        }
        res.json(resume);

    }
    catch(error){
        res.status(500).json({
            message: "failed to get resume by id",
            error: error.message
        });
    }
}
export const updateResume=async (req,res)=>{
    try{
       const resume = await Resume.findOne({
        _id: req.params.id,
        userId: req.user._id
       })
       if(!resume){
           return res.status(404).json({message: "Resume not found"});
       }
       Object.assign(resume, req.body);
       //save the updated resume
       const savedResume = await resume.save();
       res.json(savedResume);
    }
    catch(error){
        res.status(500).json({
            message: "failed to update resume",
            error: error.message
        });
    }
}
// delete  resume function

export const deleteResume=async (req,res)=>{
try{
    const resume=await Resume.findOne({
        _id: req.params.id,
        userId: req.user._id
    });
    if(!resume){
        return res.status(404).json({message: "Resume not found"});
    }
    //create a upload folder
    const uploadsFolder = path.join(process.cwd(), 'uploads');
    if(resume.thumbnailLink){
        const oldThumbnail= path.join(uploadsFolder, resume.thumbnailLink);
        if(fs.existsSync(oldThumbnail)){
            fs.unlinkSync(oldThumbnail);
        }
    }
    if(resume.profileInfo?.profilepreviewUrl){
        const oldProfile=path.join(
            uploadsFolder,
            path.basename(resume.profileInfo.profilePreviewUrl)

        ) 
        if(fs.existsSync(oldProfile)){
            fs.unlinkSync(oldProfile)
        }
    }
    //delete the resume
    const deleted = await Resume.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id

    })
    if(!deleted){
        return res.status(404).json({message: "Resume not found"});
    }
    res.json({message: "Resume deleted successfully"});

}
catch(error){
    res.status(500).json({
        message: "failed to delete resume",
        error: error.message
    });

}
}