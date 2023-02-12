import axios from 'axios';
import { 
    INITIALIZE_TRANSACTION,
    INITIALIZE_TRANSACTION_SUCCESS,
    INITIALIZE_TRANSACTION_FAIL,
    VERIFY_TRANSACTION,
    VERIFY_TRANSACTION_SUCCESS,
    VERIFY_TRANSACTION_FAIL,
    CLEAR_ERRORS
} from '../constants/paymentConstants';

export const initializeTransaction = ({email, amount}) => async(dispatch, getState) => {
   
    try {

        dispatch({type: INITIALIZE_TRANSACTION})

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const {data} = await axios.post(`/api/v1/transaction/initialize?email=${email}&amount=${amount}`, config);

        console.log('InitializeData: ', data)

        dispatch({
            type: INITIALIZE_TRANSACTION_SUCCESS,
            payload: data.data.data
        })

        localStorage.setItem('payInit', JSON.stringify(getState().payment.paymentInitials))
        
    } catch (error) {
        dispatch({
            type: INITIALIZE_TRANSACTION_FAIL,
            payload: error.response.data.message
        })
    }

}

export const verifyTransaction = (reference, dispatcher, navigate, order, createOrder) => async(dispatch, getState) => {

   
    try {

        dispatch({type: VERIFY_TRANSACTION})

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const {data} = await axios.get(`/api/v1/transaction/verify/${reference}`, config);

        console.log('VERIFIED DATA: ', data)

        dispatch({
            type:  VERIFY_TRANSACTION_SUCCESS,
            payload: data.data
        })
        
       const verifiedData = getState().payment.verifiedData ? getState().payment.verifiedData : {}
        
       if(Object.keys(verifiedData).length > 0) {
           if(verifiedData.data.status === 'success') {

            order.paymentInfo = {
                id: verifiedData.data.id,
                status: verifiedData.data.status
            }
            console.log('Orders: ', order)
            dispatcher(createOrder(order))
            localStorage.removeItem('payInit');
            navigate('/verify-success', {replace: true})

           }
       }

        
    } catch (error) {
        console.log('error', error)
        dispatch({
            type:  VERIFY_TRANSACTION_FAIL,
            payload: error.response.data.message
        })
    }

}

export const clearErrors = () => async(dispatch) => {
    dispatch({
        type:  CLEAR_ERRORS
    })
}