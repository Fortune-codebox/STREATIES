import axios from 'axios';
import {
    ALL_CATEGORIES_REQUEST,
    ALL_CATEGORIES_SUCCESS,
    ALL_CATEGORIES_FAIL,
    ALL_SUBCATEGORIES_REQUEST,
    ALL_SUBCATEGORIES_SUCCESS,
    ALL_SUBCATEGORIES_FAIL,
    CLEAR_ERRORS 
} from '../constants/categoryConstants';


export const getCategories = () => async(dispatch) => {

    try {

        dispatch({type: ALL_CATEGORIES_REQUEST})

        const {data} = await axios.get('/api/v1/categories/all')

        dispatch({
            type: ALL_CATEGORIES_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        console.log('Error In Categories', error)
        dispatch({
            type: ALL_CATEGORIES_FAIL,
            payload: error.response.data.message
        })
    }

    
}

export const getSubCategories = () => async(dispatch) => {

    try {

        dispatch({type: ALL_SUBCATEGORIES_REQUEST})

        const {data} = await axios.get('/api/v1/subcategories/all')

        dispatch({
            type: ALL_SUBCATEGORIES_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        console.log('Error In Categories', error)
        dispatch({
            type: ALL_SUBCATEGORIES_FAIL,
            payload: error.response.data.message
        })
    }

    
}

// clear error

export const clearErrors = () => async(dispatch) => {
    dispatch({
        type:  CLEAR_ERRORS
    })
}