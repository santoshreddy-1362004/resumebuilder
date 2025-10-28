import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { authStyles as styles} from '../assets/dummystyle';
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';
import { Input } from './Inputs';


const Login=({setCurrentPage})=>{
      const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    // Add validation and login logic here
     if(!validateEmail(email)){
            setError('Invalid email address');
            return;
        }if(!password){
            setError('Password is required');
            return;
        } setError('');
        try{
            const response =await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
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
        <div className={styles.container}>
            <div className={styles.headerWrapper}>
                <h3 className={styles.title}>Welcome Back</h3>
                <p className={styles.subtitle}>Please login to your account</p>
            </div>
           {/* form */}
           <form onSubmit={handleLogin} className={styles.form}>
         <Input value={email} onChange={({target}) =>
             setEmail(target.value)} label='Email' placeholder="Enter your email" type='email'/>
        <Input value={password} onChange={(e) =>
             setPassword(e.target.value)} label='Password' placeholder="Enter your password" type="password" />
                        {error && <p className={styles.errorMessage}>{error}</p>}
                   <button type='submit' className={styles.submitButton}>
                    Login
                    
                   </button>
                   <p className={styles.submitText}>
                       dont have an account{' '}
                       <span className={styles.switchButton} onClick={() => setCurrentPage('signup')}>
                           Sign Up
                       </span>
                    </p>
                   {/*footer */}
            </form>

        </div>
    )
}

export default Login;