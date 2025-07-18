import React, { createContext, useContext, useEffect, useState } from "react";


export const ThemeContext = createContext({
    themeMode:'light',
    toggleTheme:()=>{},
    
})

export const ThemeProvider = ({children})=>{
    

    const [themeMode,setThemeMode] = useState(()=>
        localStorage.getItem('themeMode') || 'light'
    )



    const toggleTheme = () => {
        setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
       
    };

    useEffect(() => {
        localStorage.setItem('themeMode', themeMode);
        
    }, [themeMode]);



    return (
        <ThemeContext.Provider value={{themeMode,setThemeMode,toggleTheme}}>
            {children}
        </ThemeContext.Provider >
    )
}

export const useTheme = ()=>useContext(ThemeContext)