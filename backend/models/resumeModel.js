import mongoose from 'mongoose'

const ResumeSchema= new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type: String,
        required:true
    },
    thumbnailLink:{
        type:String,

    },
    template:{
        theme:String,
        colorPalette:String,
    },
    profileInfo:{
        profilePreview:String,
        fullName:String,
        designation:String,
        summary:String,

    },
    contactinfo:{
        email:String,
        phone:String,
        location:String,
        linkedin:String,
        github:String,
        website:String,

    },
    //workexperience
    workExperience:[{
        companyName:String,
        jobTitle:String,
        startDate:String,
        endDate:String,
        description:String,
    }],
    education:[{
        institution:String,
        degree:String,
        startDate:String,
        endDate:String,
        
    }],
    skills:[{
        name:String,  
        progress:String,
    }],
    projects:[{
        projectName:String,
        description:String,
        github:String,
        liveDemo:String,
    }],
        
    certifications:[{
        title:String,
        issuer:String,
        year:String,
    }],
    languages:[{
        name:String,
        progress:String,
    }],
    intrests:[String],


},
{
    timestamps:{createdAt:"creatAt", updatedAt:"updatedAt"}

}

);

export default mongoose.model('Resume', ResumeSchema);