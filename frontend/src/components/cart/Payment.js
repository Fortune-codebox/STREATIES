import React, { Fragment, useEffect } from 'react'
import axios from 'axios'
import MetaData from '../layout/MetaData'
import CheckoutSteps from './CheckoutSteps'

import {Link} from 'react-router-dom'
import { useAlert } from 'react-alert';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import {verifyTransaction, clearErrors} from '../../actions/paymentActions'
import { createOrder } from '../../actions/orderActions';
import { PaystackButton } from 'react-paystack';
import SmallLoader from '../layout/SmallLoader'


const Payment = ({paystackApiKey}) => {
    
    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth)
    const { cartItems, shippingInfo } = useSelector(state => state.cart);
    const {paymentInitials, verifiedData,  loading, error} = useSelector(state => state.payment)
    // const { error } = useSelector(state => state.newOrder);
   
   
    // Calculate Order Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const shippingPrice = itemsPrice > 200 ? 0 : 25
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2))
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);
    
    const payInit = localStorage.getItem('payInit') ? JSON.parse(localStorage.getItem('payInit')) : ''
    
    const order = {
        orderItems: cartItems,
        shippingInfo
    }

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
    }
    

    useEffect(() => {
        
   
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        // if (reference) {
        //     dispatch(verifyTransaction(reference))
        // }
        

        // if(Object.keys(verifiedData).length > 0) {
            // console.log('Data: ', verifiedData)
            //         navigate('/verify-success', {replace : true})
        //  }
        

    }, [dispatch, error])

    const handlePaystackSuccessAction = (reference) => {
        // Implementation for whatever you want to do with reference and after success call.
        console.log('Reference: ',reference);
        if(Object.keys(payInit).length > 0) {
            dispatch(verifyTransaction(payInit.reference, dispatch, navigate, order, createOrder));
        }
            
            
        
      };

    
    const handlePaystackCloseAction = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log('closed')
    }
    
    const componentProps = {
        email: user.email,
        amount: Number(totalPrice * 100),
        reference: payInit.reference,
        metadata: {
          name: user.name,
          phone: shippingInfo.phoneNo,
        },
        publicKey: paystackApiKey,
        text: "Pay Now",
        onSuccess: (data) => handlePaystackSuccessAction(data),
        onClose: () => handlePaystackCloseAction(),
      }

    

  return (
    <Fragment>
         <MetaData title={'Payment'} />

         <CheckoutSteps shipping confirmOrder payment />
         
         <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-confirm">

                    <h4 className="mb-3">Shipping Info</h4>
                    <p><b>Name:</b> {user && user.name}</p>
                    <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                    <p className="mb-4"><b>Address:</b> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</p>

                    <hr />
                    <h4 className="mt-4">Your Cart Items:</h4>

                    {cartItems.map(item => (
                        <Fragment>
                            <hr />
                            <div className="cart-item my-1" key={item.product}>
                                <div className="row">
                                    <div className="col-4 col-lg-2">
                                        <img src={item.image} alt="Laptop" height="45" width="65" />
                                    </div>

                                    <div className="col-5 col-lg-6">
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>


                                    <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                        <p>{item.quantity} x ${item.price} = <b>${(item.quantity * item.price).toFixed(2)}</b></p>
                                    </div>

                                </div>
                            </div>
                            <hr />
                        </Fragment>
                    ))}



                </div>

                <div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>Subtotal:  <span className="order-summary-values">${itemsPrice.toFixed(2)}</span></p>
                        <p>Shipping: <span className="order-summary-values">${shippingPrice}</span></p>
                        <p>Tax:  <span className="order-summary-values">${taxPrice}</span></p>

                        <hr />

                        <p>Total: <span className="order-summary-values">${totalPrice}</span></p>

                        <hr />
                        {/* <button id="checkout_btn" className="btn btn-primary btn-block"  >Pay With PayStack</button> */}
                        {loading ? <SmallLoader /> : <PaystackButton className="paystack-button"  {...componentProps} />}
                    </div>
                </div>


            </div>
         
    </Fragment>
  )
}

export default Payment
