import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../layout/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { register, clearErrors } from '../../actions/userActions'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import AOS from "aos";
import "aos/dist/aos.css";
AOS.init({duration: 2000});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Register = () => {

  const classes = useStyles();

    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    })

    const { firstname, lastname, email, password } = user;

    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')

    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    useEffect(() => {

      if (isAuthenticated) {
        navigate('/', {replace: true })
      }

      if (error) {
          alert.error(error);
          dispatch(clearErrors());
      }

  }, [dispatch, alert, isAuthenticated, error, navigate])
   

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set('name', firstname + ' ' + lastname);
    formData.set('email', email);
    formData.set('password', password);
    formData.set('avatar', avatar);

    dispatch(register(formData))
}

const onChange = e => {
  console.log(e.target.files)
  if (e.target.name === 'avatar') {

      const reader = new FileReader();

      reader.onload = () => {
          if (reader.readyState === 2) {
              console.log('reader', reader)
              setAvatarPreview(reader.result)
              setAvatar(reader.result)
          }
      }
      console.log('file 0', e.target.files[0])
      reader.readAsDataURL(e.target.files[0])

  } else {
      setUser({ ...user, [e.target.name]: e.target.value })
  }
}
  return (
    
    <Fragment>

      <MetaData title={'Register user'} />
      
      <Container data-aos="fade-up" component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={submitHandler} noValidate encType='multipart/form-data'>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstname"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={firstname}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastname"
                autoComplete="lname"
                value={lastname}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={onChange}
              />
            </Grid>
           
          </Grid>
         
          <div className='form-group mt-3'>
                  <label htmlFor='avatar_upload'>Avatar</label>
                  <div className='d-flex align-items-center'>
                      <div>
                          <figure className='avatar mr-3 item-rtl'>
                              <img
                                  src={avatarPreview}
                                  className='rounded-circle'
                                  alt='Avatar Preview'
                              />
                          </figure>
                      </div>
                      <div className='custom-file'>
                          <input
                              type='file'
                              name='avatar'
                              className='custom-file-input'
                              id='customFile'
                              accept="images/*"
                              onChange={onChange}
                          />
                          <label className='custom-file-label' htmlFor='customFile'>
                              Choose Avatar
                          </label>
                      </div>
                  </div>
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{background: '#febd69', color: 'black', width: '100%',padding: "0.4rem 1.8rem"}}
            className={classes.submit}
            disabled={loading ? true : false}
          >
            Sign Up
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      
    </Container>
    </Fragment>
  )
}

export default Register
