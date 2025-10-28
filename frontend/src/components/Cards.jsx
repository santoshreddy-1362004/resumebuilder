import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {UserContext} from  '../context/UserContext';
import { cardStyles } from '../assets/dummystyle';

//profile info cards

export const ProfileInfoCard=()=>{
    const navigate =useNavigate();
    const {user,clearUser}= useContext(UserContext);
    const handleLogout=()=>{
        clearUser();
        navigate('/');
    }
    return(
        user &&(
            <div className={cardStyles.profileCard}>
                <div className={cardStyles.profileInitialsContainer}>
                    <span className={cardStyles.profileInitialsText}>
                        {user.name?user.name.charAt(0).toUpperCase():""}

                    </span>

                </div>
                <div className={cardStyles.profileName}>
                    {user.name || "Unknown User"}
                </div>
                <button className={cardStyles.logoutButton} onClick={handleLogout}>
                    Logout
                </button>
            </div>
        )
    )
}