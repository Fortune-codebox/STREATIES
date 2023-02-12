import React, { Fragment, useState } from 'react'
import { getNames } from 'country-list'
import {useNavigate} from 'react-router-dom'

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import MetaData from '../layout/MetaData';
import CheckoutSteps from './CheckoutSteps';

import { useDispatch, useSelector } from 'react-redux'
import { saveShippingInfo } from '../../actions/cartActions'

const Shipping = () => {

    const countriesList = Object.values(getNames())
    const navigate = useNavigate()
    const { shippingInfo } = useSelector(state => state.cart)

    const [address, setAddress] = useState(shippingInfo.address)
    const [city, setCity] = useState(shippingInfo.city)
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode)
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo)
    const [country, setCountry] = useState(shippingInfo.country)

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault()

        dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country }))
        navigate('/confirm', {replace: true})
    }
  return (
    <Fragment>
         <MetaData title={'Shipping Info'} />
          
         <CheckoutSteps shipping />

         <div className="row wrapper">
                <div className="col-10 col-lg-5">
                

                    <form  onSubmit={submitHandler}>
                    <h2 className="mb-4">Shipping Info</h2>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="address_field"
                                label="Address"
                                name="address"
                                autoComplete="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                         </Grid>


                        <Grid item xs={12} className="mt-3">
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="city_field"
                                label="City"
                                name="city"
                                autoComplete="address"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                         </Grid>

                       
                        <Grid item xs={12} className="mt-3">
                            <TextField
                                variant="outlined"
                                type="phone"
                                required
                                fullWidth
                                id="phone_field"
                                label="Phone"
                                name="phone"
                                autoComplete="phone"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                            />
                         </Grid>
                        

                        <Grid item xs={12} className="mt-3">
                            <TextField
                                variant="outlined"
                                type="number"
                                required
                                fullWidth
                                id="postal_code_field"
                                label="Postal Code"
                                autoComplete="postal"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                         </Grid>

                        <div className="form-group" className="mt-3">
                            <label htmlFor="country_field">Country</label>
                            <select
                                id="country_field"
                                className="form-control"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            >

                                {countriesList.map((country, i) => (
                                    <option key={i} value={country}>
                                        {country}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            CONTINUE
                            </button>
                    </form>
                </div>
            </div>

    </Fragment>
  )
}

export default Shipping
