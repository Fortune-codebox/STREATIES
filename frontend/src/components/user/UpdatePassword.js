import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../layout/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { updatePassword, clearErrors } from '../../actions/userActions'
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';
import {useNavigate} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Icon } from '@iconify/react';

const UpdatePassword = () => {

    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')

    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { error, isUpdated, loading } = useSelector(state => state.user)

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success('Password updated successfully')

            navigate('/me', {replace: true})

            dispatch({
                type: UPDATE_PASSWORD_RESET
            })
        }

    }, [dispatch, alert, error, navigate, isUpdated])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('oldPassword', oldPassword);
        formData.set('password', password);

        dispatch(updatePassword(formData))
    }


  return (
    <Fragment>
    <MetaData title={'Change Password'} />

    <div className="row wrapper">
        <div className="col-10 col-lg-5">
            <form  onSubmit={submitHandler}>
                <h3 className="mt-2 mb-5"><Icon icon="arcticons:nc-passwords" height="40" />
                    Update Password</h3>
                <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="old_password_field"
                        label="Old Password"
                        name="oldPassword"
                        autoComplete="oldPassword"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    </Grid>


                    <Grid item xs={12} className="mt-4">
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="new_password_field"
                            label="Password"
                            name="password"
                            autoComplete="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </Grid>

               

                <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled={loading ? true : false} >Update Password</button>
            </form>
        </div>
    </div>

</Fragment>
  )
}

export default UpdatePassword
