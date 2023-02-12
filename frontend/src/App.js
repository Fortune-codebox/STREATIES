import './App.css';
import React, { Fragment, useEffect, useState } from 'react'
import {BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom';
import axios from 'axios'

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './components/Home';
import ProductDetails from './components/product/ProductDetails';

//Carts
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'
import ListOrders from './components/order/ListOrders';
import OrderDetails from './components/order/OrderDetails'

import Login from './components/user/Login';
import Register from './components/user/Register';
import ForgotPassword from './components/user/ForgotPassword'
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import NewPassword from './components/user/NewPassword';

// Admin Imports
import Dashboard from './components/admin/Dashboard'


import ProtectedRoute from './components/route/ProtectedRoute'

import {loadUser} from './actions/userActions';
import {verifyTransaction} from './actions/paymentActions'
import store from './store';
import {useSelector} from 'react-redux'


function App() {

  const { isAuthenticated, user, loading } = useSelector(state => state.auth)
  const [paystackApiKey, setPaystackApiKey] = useState('');
  // const payInit = localStorage.getItem('payInit') ? JSON.parse(localStorage.getItem('payInit')) : '';

  const isAdmin = user && user.role === 'admin' ? true : false;

  useEffect(() => {

      store.dispatch(loadUser());


      async function getPaystackKey() {
        const { data } = await axios.get('/api/v1/paystackapi');

        setPaystackApiKey(data.paystackApiKey)
      }
      if(isAuthenticated) {
        getPaystackKey();
      }



  }, [])

  function Layout() {
    return (
       <Fragment>
           <Header />
           <div className="container container-fluid">
             <Outlet />
           </div>
       </Fragment>
    )
  }

  function AdminLayout() {
    return (
      <Fragment>
         {/* <Header /> */}
         <div>
           <Outlet />
         </div>
      </Fragment>
    )
  }


  return (
    <Router>
      <div className="App">

          <Routes>

            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="search/:keyword" element={<Home />} />
              <Route path="product/:prodId" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="password/forgot" element={<ForgotPassword />} />
              <Route path="password/reset/:token" element={<NewPassword />} />

              <Route
                path="shipping"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Shipping />
                  </ProtectedRoute>
                }

              />

            { paystackApiKey &&  <Route
              path="payment"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Payment paystackApiKey={paystackApiKey} />
              </ProtectedRoute>
              }
              />}

            <Route
                path="verify-success"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <OrderSuccess  />
                  </ProtectedRoute>
                }

              />

              <Route
                path="orders/me"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <ListOrders  />
                  </ProtectedRoute>
                }

              />

              <Route
                path="order/:id"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <OrderDetails  />
                  </ProtectedRoute>
                }

              />


              <Route
              path="confirm"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <ConfirmOrder />
                </ProtectedRoute>
              }
              />

              <Route
                path="me"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Profile />
                  </ProtectedRoute>}
                />

              <Route
               path="me/update"
               element={
                 <ProtectedRoute isAuthenticated={isAuthenticated}>
                   <UpdateProfile />
                 </ProtectedRoute>
               }
              />
              <Route
               path="password/update"
               element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <UpdatePassword />
                </ProtectedRoute>
              }
              />

          </Route>


          {/* Admin Routes */}
          {isAuthenticated && isAdmin && <Route path="dashboard" element={<AdminLayout />}>

              <Route
                index
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin} >
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

          </Route>}



          </Routes>

        <Footer />
      </div>
   </Router>
  );
}

export default App;

