import React from 'react'
import { Navigate } from 'react-router-dom'
import {useSelector} from 'react-redux'


const ProtectedRoute = ({children, ...props }) => {

    const {loading, user } = useSelector(state => state.auth)

    return props.isAuthenticated ? children 
    : props.isAuthenticated && props.isAdmin && user.role === 'admin' ? children
    : <Navigate replace to='/' /> 
    
}

export default ProtectedRoute
