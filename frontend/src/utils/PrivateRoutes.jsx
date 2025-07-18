import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Spinner } from "./Spinner";


const PrivateRoutes = ({children}) =>{
    const {isAuthenticated,loading} = useAuth()

    if (loading) return <Spinner/>

    return isAuthenticated ? children : <Navigate to="/" replace/>
}

export default PrivateRoutes