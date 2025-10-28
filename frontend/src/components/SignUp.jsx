import React, { useState, useContext } from 'react';
import { authStyles as styles } from '../assets/dummystyle';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';
import { Input } from './Inputs';
const SignUp=({setCurrentPage}) =>{
     const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUP =async(e)=>{
    e.preventDefault();
    if(!fullName){
        setError('Full name is required');
        return
    
    }if(!validateEmail(email)){
        setError('Invalid email address');
        return;
    }if(!password){
        setError('Password is required');
        return;
    }
    setError('');
    try{
        const response =await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
            name:fullName,
            email,
            password,
        });
        const{token}=response.data;
        if(token){
            localStorage.setItem('token',token);
            updateUser(response.data);
            navigate('/dashboard');
        }
    }catch(error){
        setError(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  }
    return(
        <div className={styles.signupContainer}>
            <div className={styles.headerWrapper}>
                <h3 className={styles.signupTitle}>Create Account</h3>
                <p className={styles.signupSubtitle}>Please sign up to continue</p>
            </div>
            {/* form */}
            <form onSubmit={handleSignUP} className={styles.signupForm}>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} label="Full Name" placeholder="Enter your full name"type='text' />
            <Input value={email} onChange={(e) => setEmail(e.target.value)} label="Email" placeholder="Enter your email" type="email" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} label="Password" placeholder="Enter your password" type="password" />

            {error && <p className={styles.errorMessage}>{error}</p>}
       <button type='submit' className={styles.signupSubmit}>
        Create Account
       </button>
       {/*footer */}
       <p className={styles.switchText}>
           Already have an account?{' '}
           <button onClick={()=>setCurrentPage('login')}
           type='button'className={styles.signupSwitchButton}>
                Log In
           </button>
           </p>
       
       </form>
       
        </div>


    )

}
export default SignUp;