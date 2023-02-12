import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';

import { Icon } from '@iconify/react';
import { Container } from 'react-bootstrap';

import {useDispatch, useSelector} from 'react-redux'
import {useAlert} from 'react-alert';
import { logout } from '../../actions/userActions';
import streaties from '../../images/streaties3.png'


const Header = () => {
  // const classes = useStyles()

  const alert = useAlert();
  const dispatch = useDispatch()
  let {user, loading } = useSelector(state => state.auth)
  const {cartItems} = useSelector(state => state.cart)


const logoutHandler = () => {
    dispatch(logout());
    alert.success('Logged out successfully.')
}
  return (
    <Fragment>

      <nav className="navbar row">
      <Container>
        <div className="col-12 col-md-3">
            <div className="navbar-brand" >
              <Link to="/">
                <img src={streaties} height="70px" alt="logo" />
              </Link>
            </div>
        </div>

        <div className="col-12 col-md-5 mt-2 mt-md-0">
             <Search />

        </div>

        <div className="col-12 col-md-4 mt-4 mt-md-0 text-center">
            {/* <button className="btn" id="login_btn">Login</button> */}

            <Link to="/cart" style={{textDecoration: 'none'}}>
            <span id="cart" className="ml-4" ><Icon icon="bytesize:cart" height="25" /> Cart </span>
            <sup  style={{borderRadius: "40px", marginLeft: '-4px'}} id="cart_count">{cartItems.length}</sup>
            </Link>




            {user && !loading ? (
              <Fragment>
                <div className="ml-4 dropdown d-inline" >
                <Link to='#!' className="btn dropdown-toggle text-white mr-4"  type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >

                    {user.avatar ? (
                        <figure className="avatar avatar-nav">
                        <img
                            src={user.avatar ? user.avatar.url : ''}
                            alt={user ? user.name : ''}
                            className="rounded-circle"
                        />
                    </figure>
                    ) : (
                      <figure className="avatar avatar-nav">
                        <img
                            src={'/images/default_avatar.jpg'}
                            alt={'default'}
                            className="rounded-circle"
                        />
                    </figure>
                    )}


                    <span>{user && user.name}</span>
                </Link>

                <div className="dropdown-menu mt-3" aria-labelledby="dropDownMenuButton">

                    {user && user.role === 'admin' && (
                        <Link className="dropdown-item" to="/dashboard"><Icon icon="iwwa:dashboard" height="18" /> Dashboard</Link>
                    )}
                    <Link className="dropdown-item" to="/orders/me"> <Icon icon="icon-park-outline:transaction-order" height="18" /> Orders</Link>
                    <Link className="dropdown-item" to="/me"><Icon icon="gg:profile" height="18" /> Profile</Link>
                    <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}>
                    <Icon icon="ri:logout-circle-r-line" height="18" />  Logout
                    </Link>

                </div>


              </div>
              </Fragment>

            ): (<Link to="/login" className="btn ml-4" id="login_btn" >
               {loading && (
                  <i
                    className="fa fa-refresh fa-spin"
                    style={{ marginRight: "5px" }}
                  />
                )}
              SIGN IN
              </Link>)}



        </div>
     </Container>
    </nav>

    </Fragment>
  )
}

export default Header
