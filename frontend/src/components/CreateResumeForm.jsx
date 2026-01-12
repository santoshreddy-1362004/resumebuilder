import React, { useState } from 'react';
import { Input } from './Inputs';
import {useNavigate} from 'react-router-dom';
import {API_PATHS} from '../utils/apiPath';
import axiosInstance from '../utils/axiosInstance';
const CreateResumeForm=({onSuccess})=>{
    const[title,setTitle] = useState(" ");
    const[error,setError]=useState(null);
    const navigate=useNavigate();
    
    const handleCreateResume= async(e)=>{
        e.preventDefault();

        if(!title){
            setError("Title is required");
            return;
        }
        setError("")

        try {
            const response= await axiosInstance.post(API_PATHS.RESUME.CREATE,{
                title,
            });
            if(response.data?._id){
                onSuccess?.();
                navigate(`/resume/${response.data?._id}`);
            }
            
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            } else {
                setError("An error occurred while creating the resume. Please try again.");
            }
            
        }

    }


    return(
        <div className='w-full max-w-md p-8 bg-white rounded-2xl border border-gray-300 shadow-lg'>
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>Create Resume</h3>
            <p className='text-gray-600 mb-8'> 
                give your resume a title to help you identify it later.
            </p>
            <form onSubmit={handleCreateResume}>
                <Input value={title} onChange={({target})=> setTitle(target.value)}
                label ='resume Title' placeholder='eg. John Doe-Software Engineer Resume'
                type = 'text'/>
                {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
                <button className='w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-rose-200 transition-all'>
                    Create Resume
                </button>
            </form>
           
        </div>

    )
}
export default CreateResumeForm;