import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import SearchIcon from "@material-ui/icons/Search";
import { alpha, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.85),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.85),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '15ch',
      '&:focus': {
        width: '40ch',
      },
    },
  },
}));

const Search = () => {
  const classes = useStyles()
  const [keyword, setkeyword] = useState('')
  let navigate = useNavigate();
  
 const searchHandler = (e) => {
      e.preventDefault()
      

      if(keyword.trim()) {
          navigate(`/search/${keyword}`,{replace: true })
      } else {
        navigate('/', {replace: true })
      }
 }



  return (
    <div className="ml-2">
       <form onChange={searchHandler}>
            <Toolbar>
                {/* <input
                    type="text"
                    id="search_field"
                    className="form-control "
                    placeholder="Enter Product Name ..."
                    onChange={(e) => setkeyword(e.target.value)}
                /> */}

                  {/* <TextField
                    label="Enter Product Name"
                    required
                    style={{background: 'white', color: 'black', borderRadius: '50px'}}
                    variant="outlined"
                    value={keyword}
                    onChange={(e) => setkeyword(e.target.value)}
                    autoComplete="search"
                    autoFocus
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment>
                          <IconButton>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  /> */}

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search Product…"
              name="search"
              value={keyword}
              required
              onChange={(e) => setkeyword(e.target.value)}
              autoFocus
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>

                {/* <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="search_field"
                  label="Enter Product Name ..."
                  name="search"
                  value={keyword}
                  onChange={(e) => setkeyword(e.target.value)}
                  autoComplete="search"
                  autoFocus
                /> */}
                {/* <div className="input-group-append">
                    <button id="search_btn" className="btn">
                    <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div> */}
            </Toolbar>
       </form>
    </div>
  )
}

export default Search
