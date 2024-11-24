import '../Auth/Login/Login.css'
import { Avatar, Button, Checkbox, CssBaseline, FormControlLabel, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MdLockOutline } from 'react-icons/md'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri'
import { baseUrl, update_password } from '../Constants/urls'




const Account = () => {
  const [credentials, setCredentials] = useState({ oldPassword: localStorage.getItem('password') ? localStorage.getItem('password') : '', password: "" })
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!credentials.password) {
        toast.error("All fields are required", { autoClose: 500, theme: 'colored' })
      }
      else if (credentials.password.length < 5) {
        toast.error("Please enter valid password", { autoClose: 500, theme: 'colored' })
      }
      else if (credentials.password) {
        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('user_id'));
        formData.append('password', credentials.password);
        const sendAuth = await axios.post(baseUrl + update_password, formData, { 
          headers: {
          'Content-Type': 'multipart/form-data'
          }
        });
        const receive = await sendAuth.data
        const resp = new Map(Object.entries(receive))
        const token = resp.get('token')
        if (token) {
          toast.success("Update Successfully", { autoClose: 500, theme: 'colored' })
          localStorage.setItem('Authorization', receive.token)
          localStorage.setItem('password', credentials.password)
        } else{
          toast.error("Something went wrong, Please try again", { autoClose: 500, theme: 'colored' })
        }
        setCredentials({ ...credentials, oldPassword: localStorage.getItem('password'), password: '' })
      }
    }
    catch (error) {
      error.response.data.error.length === 1 ?
        toast.error(error.response.data.error[0].msg, { autoClose: 500, theme: 'colored' })
        : toast.error(error.response.data.error, { autoClose: 500, theme: 'colored' })
    }

  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
          <MdLockOutline />
        </Avatar>
        <Typography component="h1" variant="h5">
          Update Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="oldPassword"
            label="Old Password"
            value={credentials.oldPassword}
            name='oldPassword'
            clickable={false}
            focused={false}
            slotProps={{
              input: {
                readOnly: true
              }
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            focused
            value={credentials.password}
            name='password'
            onChange={handleOnChange}
            label="New Password"
            type={showPassword ? "text" : "password"}
            id="password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" onClick={handleClickShowPassword} sx={{cursor:'pointer'}}>
                  {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                </InputAdornment>
              )
            }}
            autoComplete="current-password"

          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Password
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default Account