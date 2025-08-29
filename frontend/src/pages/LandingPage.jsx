import React from 'react'
import { landingPageStyles } from '../assets/dummystyle'
import {LayoutTemplate} from 'lucide-react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                 onclick={()=>setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? 
                    <X size={24} className={landingPageStyles.mobileMenuIcon} />:
                    <Menu size={24} className={landingPageStyles.mobileMenuIcon} />}
                
                </button>
                {/* DESKTOP NAVIGATION */}
                <div className='hidden md:flex items-center'>
                  {user}
                </div>

            </div>


        </header>

    </div>
  )
}

export default LandingPage