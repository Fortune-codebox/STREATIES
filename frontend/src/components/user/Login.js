import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../layout/MetaData';
import {useSelector, useDispatch} from 'react-redux';
import {useAlert} from 'react-alert';
import {useNavigate, useLocation, Link} from 'react-router-dom'
import {login, verifyToken, clearErrors} from '../../actions/userActions'

import Avatar from '@material-ui/core/Avatar';
import Button from 'react-bootstrap-button-loader';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
// import { CLoadingButton } from '@coreui/react-pro'

import AOS from "aos";
import "aos/dist/aos.css";
AOS.init({duration: 1000});

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {

  const classes = useStyles();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState('')
  let navigate = useNavigate()

  const alert = useAlert();
  const dispatch = useDispatch()


  const { isAuthenticated, error, loading, verification_key, message } = useSelector(state => state.auth)
  const redirect = location.search ? '/' + location.search.split('=')[1] : '/'
  useEffect(() => {

    if(error) {
        alert.error(error);
        dispatch(clearErrors())
    }

    if(isAuthenticated) {
      navigate(redirect, {replace: true })
    }

    

  }, [dispatch, alert, isAuthenticated, error, navigate])

  const submitHandler = (e) => {
    e.preventDefault();

    if(verification_key) {

      dispatch(verifyToken(verification_key, email, otp, navigate));
      

    } else {
      dispatch(login(email, password))
    }

}

const toggleShowPassword = () => setShowPassword(showPassword => !showPassword);

const handleMouseDownPassword = (event) => {
  event.preventDefault();
};

  return (
    <Fragment>
      <MetaData title={'Login'} />
      <Container data-aos="fade-up" component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={submitHandler} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
            {/* <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => !setShowPassword()}
                    onMouseDown={(e) => handleMouseDownPassword(e)}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }

            /> */}

            
            <FormControl className="mt-3 mb-2" fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => toggleShowPassword()}
                      onMouseDown={(e) => handleMouseDownPassword(e)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                
              />
              </FormControl>


            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            
            {verification_key ? (
              <Fragment>
                <div data-aos="fade-up">
                  <div className="shadow-sm mb-2" style={{background: '#dcdcdc', padding: '10px', border: "2px solid #dcdcdc"}}>
                  <p>
                  {message}
                  </p>
                  </div>
                 

                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="otp"
                      label="One Time Password"
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      autoComplete="current-otp"
                    />
                </div>
                
              </Fragment>
            ) : ''}

          

            <Button
              type="submit"
              style={{background: '#febd69', color: 'black', width: '100%',padding: "0.4rem 1.8rem"}}
              loading={loading}
            >
              Sign In
            </Button>

            <Grid container className="mt-2">
              <Grid item xs>
                <Link to="/password/forgot" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        
      </Container>

    </Fragment>


    
  )
}

export default Login
