import react from 'react';

const DashboardLayout=({activeMenu,children})=>{
    const {user} = useContext(UserContext);
    return(
        <div>
            <NavBar activeMenu={activeMenu}/>
            {user && <div className='container mx-auto pt-4 pb-4'>{children}</div> }

        </div>
    )
}

export default DashboardLayout;