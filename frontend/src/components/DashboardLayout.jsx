import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Navbar from './Navbar';

const DashboardLayout=({activeMenu,children})=>{
    const {user, loading} = useContext(UserContext);
    
    if (loading) {
        return (
            <div>
                <Navbar activeMenu={activeMenu}/>
                <div className='container mx-auto pt-4 pb-4 flex items-center justify-center min-h-[60vh]'>
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }
    
    return(
        <div>
            <Navbar activeMenu={activeMenu}/>
            {user && <div className='container mx-auto pt-4 pb-4'>{children}</div> }

        </div>
    )
}

export default DashboardLayout;