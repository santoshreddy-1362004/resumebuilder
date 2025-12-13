import react,{use, useRef,useState} from "react";
import{resumeTemplates} from '../utils/data';

import{resumeTemplates} from '../utils/data';
const TAB_DATA=[{label:'Templates'}]
const ThemeSelector=({selectedTheme,setSelectedTheme,resumeData,onClose})=>{
    const resumeRef=useRef(null);
    const[baseWidth,setBaseWidth]=useState(800);

    //selected theme using id
    const intailIndex =resumeTemplates.findIndex(t=>t.id===selectedTheme.id);
    const[selectedTheme,setSelectedTheme] = useState({
        theme: selectedTheme||resumeTemplates[0]?.id||"",
        index: initialIndex>=0 ? intialIndex:0
    })
    const[tabValue,setTabValue]=useState('Templates')
     return(
        <div className="max-w-7xl mx-auto px-4">
            {/*header*/}
            Theme Selector 

        </div>
    )
}


   


export default ThemeSelector;