import react, { useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { dashboardStyles as styles } from '../assets/dummystyle'


const Dashboard = () => {
  const navigate = useNavigate();
  const[openCreateModal,setOpenCreateModal]=react.useState(false);
  const [allResumes,setAllResumes]=useState([]);
  const [loading,setLoading]=useState(true);
  const[resumeToDelete,setResumeToDelete]=useState(null);
  const[showDeleteConfirm,setShowDeleteConfirm]=useState(false);

   // Calculate completion percentage for a resume
  const calculateCompletion = (resume) => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info
    totalFields += 3;
    if (resume.profileInfo?.fullName) completedFields++;
    if (resume.profileInfo?.designation) completedFields++;
    if (resume.profileInfo?.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resume.contactInfo?.email) completedFields++;
    if (resume.contactInfo?.phone) completedFields++;

    // Work Experience
    resume.workExperience?.forEach(exp => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resume.education?.forEach(edu => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills
    resume.skills?.forEach(skill => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resume.projects?.forEach(project => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resume.certifications?.forEach(cert => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages
    resume.languages?.forEach(lang => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += (resume.interests?.length || 0);
    completedFields += (resume.interests?.filter(i => i?.trim() !== "")?.length || 0);

    return Math.round((completedFields / totalFields) * 100);
  };
  //it will  show if conpleted it will do ++
  const fetchAllResumes=async()=>{
    try{
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      //add completion percentage to each resume
      const resumesWithCompletion=response.data.resumes.map(resume=>({
        ...resume,
        completion:calculateCompletion(resume)
      }));
      setAllResumes(resumesWithCompletion);
      
    }
    catch(error){
      console.error('Error fetching resumes:',error);

    }
    finally{
      setLoading(false);
    }
    
  };
  useEffect((()=>{
    fetchAllResumes();
  }), [])
  return (
   <DashboardLayout>
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <div>
          <h1 className={styles.headerTitle}>Welcome back</h1>
          <p className={styles.headerSubtitle}>
            {allResumes.length>0 ?`you have ${allResumes.length}reumes${allResumes.length!== 1? 's':''}`:'start creating your professional resume'}
          </p>
        </div>

        <div className='flex gap-4'>
          <button className={styles.createButton}>
            onClick={()=>setOpenCreateModal(true)}
            <div className={styles.createButtonOverlay}> </div>
            <span className={styles.createButtonContent}>
              Create Resume
              <LucideFilePlus className='group-hover:translate-x-1 transition-transform'size={18}/>
              </span>
         </button>

        </div>



      </div>
      {/* loading state */}
      {loading &&(
        <div className={styles.spinnerWrapper}> 
        <div className={styles.spinner}></div>

     </div>

      )}
      {/*empty state */}
      {!loading && allResumes.length===0 &&(
        <div className={styles.emptyStateWrapper}>
          <div className={styles.emptyIconWrapper}>
          <LucideFilePlus size={32} className='text-violet-600'/>
           </div>
           <h3 className={styles.emptyTitle}>No resumes found</h3>
           <p className={styles.emptyText}>
            Get started by creating a new resume.
           </p>

           <button className={styles.createButton}
            onClick={()=>setOpenCreateModal(true)}>
              <div className={styles.createButtonOverlay}>

              </div>
              <span className={styles.createButtonContent}>
                Create your first Resume
                 <LucideFilePlus className='group-hover:translate-x-1 transition-transform' size={20}/>


              </span>

           </button>

          </div>

      )}
      {/* resumes grid */}
      {!loading && allResumes.length>0 &&(
        <div className={styles.grid}>
          <div className={styles.newResumeCard} onClick={()=>setOpenCreateModal(true)}> 
            <div className={styles.newResumeIcon}>
              <LucideFilePlus size={32} className='text-white'/>

            </div>
            <h3 className={styles.newResumeTitle}>Create New Resume</h3>
            <p className={styles.newResumeText}>start building your career </p>
          </div>
          

          </div>

      )}
        


        


      

    </div>
   </DashboardLayout>
  )
}

export default Dashboard