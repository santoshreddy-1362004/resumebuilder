import react from 'react';
import templateOne from './TemplateOne';
import templateTwo from './TemplateTwo';

const RenderResume=({
    templateId,
    resumeData,
    containerWidth,

})=>{
        switch(templateId){
            case "01":
                 return (
                    <TemplateOne resumeData={resumeData} containerWidth={containerWidth}/>
                  )
            case "02":
                return(
                    <TemplateTwo resumeData={resumeData} containerWidth={containerWidth}/>
                )
            case "03":
                <TemplateThree resumeData={resumeData} containerWidth={containerWidth}/>
                
}
}

export default RenderResume;