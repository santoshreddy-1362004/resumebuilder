import React, { use, useContext } from 'react'
import { landingPageStyles } from '../assets/dummystyle'
import {LayoutTemplate} from 'lucide-react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {UserContext} from  '../context/UserContext';

const LandingPage = () => {
  const {user}= useContext(UserContext);
  const navigate= useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openAuthModal, setOpenAuthModal] = useState(false);

  return (
    <div className={landingPageStyles.container}>
        {/*Header*/}
        <header className={landingPageStyles.header}>
            <div className={landingPageStyles.headerContainer}>
                <div className={landingPageStyles.logoContainer}>
                    <div className={landingPageStyles.logoIcon}>
                    <LayoutTemplate className={landingPageStyles.logoIconInner} />
                    </div>
                    <span className={landingPageStyles.logoText}>
                       ResumeXpert
                    </span>

                </div>
                {/* mobile menu button */}
               <button className={landingPageStyles.mobileMenuButton}
                 onClick={()=>setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? 
                    <X size={24} className={landingPageStyles.mobileMenuIcon} />:
                    <Menu size={24} className={landingPageStyles.mobileMenuIcon} />}
                
                </button>
                {/* DESKTOP NAVIGATION */}
                <div className='hidden md:flex items-center'>
                  {user ? (
                    <div className="px-4 py-2 bg-violet-100 text-violet-700 rounded-lg">
                      Welcome back!
                    </div>
                  ) : (
                    <button className={landingPageStyles.desktopAuthButton} onClick={() => setOpenAuthModal(true)}>
                      <div className={landingPageStyles.desktopAuthButtonOverlay}>
                         </div>
                      <span className={landingPageStyles.desktopAuthButtonText}>
                        get started
                      </span>
                    </button>
                  )}
                </div>

            </div>


        </header>

        

    </div>
  )
}

export default LandingPage