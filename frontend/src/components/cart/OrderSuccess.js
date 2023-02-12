import React, { Fragment, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MetaData from '../layout/MetaData';
import {verifyTransaction, loading} from '../../actions/paymentActions'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../layout/Loader'

const OrderSuccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {verifiedData , loading} = useSelector(state => state.payment)

    
   
    useEffect(() => {

        if(verifiedData) {
            console.log('Verified On Success', verifiedData)
        }
        
       
        

    }, [dispatch, verifiedData])


    return (
        <Fragment>

            <MetaData title={'Order Success'} />

            {loading ? <Loader /> : (
                <Fragment>

                    <div className="row justify-content-center">
                        <div className="col-6 mt-5 text-center">
                            <img className="my-5 img-fluid d-block mx-auto" src="/images/order_success.png" alt="Order Success" width="200" height="200" />

                            <h2>Your Order has been placed successfully.</h2>

                            <Link to="/orders/me">Go to Orders</Link>
                        </div>

                    </div>

                </Fragment>
            )}

            

        </Fragment>
    )
}

export default OrderSuccess