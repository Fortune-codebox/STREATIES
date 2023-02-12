import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../layout/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword, clearErrors } from '../../actions/userActions';
import {useNavigate} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';

const NewPassword = () => {

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const alert = useAlert();
    const {token} = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { error, success } = useSelector(state => state.forgotPassword)

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success('Password updated successfully')
            navigate('/login', {replace: true})
        }

    }, [dispatch, alert, error, success, navigate])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('password', password);
        formData.set('confirmPassword', confirmPassword);

        dispatch(resetPassword(token, formData))
    }
  return (
    <Fragment>

    <MetaData title={'New Password Reset'} />

    <div className="row wrapper">
        <div className="col-10 col-lg-5">
            <form onSubmit={submitHandler}>
                <h2 className="mb-3"><Icon icon="arcticons:passbolt" color="#000058" height="40" /> New Password</h2>


                <Grid item xs={12} className="mt-4">
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="password_field"
                        label="Password"
                        name="password"
                        autoComplete="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </Grid>


                <Grid item xs={12} className="mt-4">
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="confirm_password_field"
                        label="Confirm Password"
                        name="confirmPassword"
                        autoComplete="confirm_password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    </Grid>

                

                <button
                    id="new_password_button"
                    type="submit"
                    className="btn btn-block py-3">
                    Set Password
                </button>

            </form>
        </div>
    </div>

</Fragment>
  )
}

export default NewPassword
