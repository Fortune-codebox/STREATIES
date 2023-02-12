import { 
    INITIALIZE_TRANSACTION,
    INITIALIZE_TRANSACTION_SUCCESS,
    INITIALIZE_TRANSACTION_FAIL,
    VERIFY_TRANSACTION,
    VERIFY_TRANSACTION_SUCCESS,
    VERIFY_TRANSACTION_FAIL,
    CLEAR_ERRORS
} from '../constants/paymentConstants'


export const paymentReducer = (state = {paymentInitials: {}, verifedData : {}}, action) => {
    switch(action.type) {
        case INITIALIZE_TRANSACTION:
            return {
                loading: true,
                paymentInitials: {}
            }
        case INITIALIZE_TRANSACTION_SUCCESS:
            return {
                loading: false,
                paymentInitials: action.payload
            }

        case INITIALIZE_TRANSACTION_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case VERIFY_TRANSACTION:
            return {
                loading: true,
                verifiedData: {}
            }

        case VERIFY_TRANSACTION_SUCCESS:
            return {
                loading: false,
                verifiedData: action.payload
            }
        case VERIFY_TRANSACTION_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}