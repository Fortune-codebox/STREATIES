import React, {Fragment, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import Loader from '../layout/Loader'
import {useNavigate} from 'react-router-dom'
import {useAlert} from 'react-alert';

import MetaData from '../layout/MetaData';
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init({duration: 1000});

const Profile = () => {
   const {loading, error, user} = useSelector(state => state.auth) 

  return (
    <Fragment>
        {loading ? <Loader /> : (
            <Fragment>
                <MetaData title={'Your Profile'} />
                {/* {user ? ( */}
                    <div data-aos="fade-up" className="container container-fluid">
                    <h2 className="mt-5 ml-5">My Profile</h2>
                    <div className="row justify-content-around mt-5 user-info">
                        <div className="col-12 col-md-3">
                            <figure className='avatar avatar-profile'>
                                <img className="rounded-circle img-fluid" src={user.avatar.url ? user.avatar.url : '/images/default_avatar.jpg'} alt={user.name ? user.name : 'default'}  />
                            </figure>
                            <Link to="/me/update" id="edit_profile" className="btn btn-primary btn-block my-5">
                                Edit Profile
                            </Link>
                        </div>
                
                        <div className="col-12 col-md-5">
                            <h4>Full Name</h4>
                            <p>{user.name}</p>
                
                            <h4>Email Address</h4>
                            <p>{user.email}</p>

                            <h4>Joined On</h4>
                            <p>{String(user.createdAt).substring(0, 10)}</p>

                            {user.role !== 'admin' && (
                            <Link to="/orders/me" className="btn btn-danger btn-block mt-5">
                                My Orders
                            </Link>
                            )}

                            <Link to="/password/update" className="btn btn-primary btn-block mt-3">
                                Change Password
                            </Link>
                        </div>
                    </div>
                </div>

                
                
             </Fragment>
        )}
    </Fragment>
  )
}

export default Profile
