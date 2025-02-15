// React Imports
import { useState, useEffect, forwardRef, useCallback } from 'react'

import { useSession } from 'next-auth/react'

// MUI Imports
import {
  Box,
  Drawer,
  Select,
  Switch,
  Button,
  MenuItem,
  TextField,
  IconButton,
  InputLabel,
  Typography,
  useMediaQuery,
  FormControl,
  FormControlLabel
} from '@mui/material'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import PerfectScrollbar from 'react-perfect-scrollbar'


// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Vars
const capitalize = string => string && string[0].toUpperCase() + string.slice(1)

// API URL (Ensure it's set in your environment variables)
const API_URL = process.env.NEXT_PUBLIC_API_URL

const AddEventSidebar = props => {
  // Props
  const { addEventSidebarOpen, handleAddEventSidebarToggle } = props

  // Session for vendor details
  const { data: session } = useSession()
  const vendorId = session?.user?.id


  // States
  const [meetingDetails, setMeetingDetails] = useState({
    name: '',
    department: '',
    email: '',
    mobile: '',
    businessURL: '',
    callbackTime: new Date()
  })


  // React Hook Form
  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { name: '', email: '', mobile: '' } })


  // Handle form submission
  const onSubmit = async data => {
    if (!vendorId) {
      alert('Vendor not logged in')
      
return
    }

    const meetingData = {
      name: meetingDetails.name,
      department: meetingDetails.department,
      email: meetingDetails.email,
      mobile: meetingDetails.mobile,
      businessURL: meetingDetails.businessURL,
      callbackTime: meetingDetails.callbackTime,
      vendorId
    }

    try {
      const response = await fetch(`${API_URL}/vendor/createmeeting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData)
      })

      const result = await response.json()

      if (response.ok) {
        alert('Meeting created successfully!')
        location.reload();
        handleAddEventSidebarToggle()
        location.reload();
      } 
      else {
        alert(result.message || 'Failed to create meeting')
      }
    } catch (error) {
      console.error('Error creating meeting:', error)
      alert('Something went wrong!')
    }
  }

  
return (
    <Drawer
      anchor='right'
      open={addEventSidebarOpen}
      onClose={handleAddEventSidebarToggle}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', 400] } }}
    >
      <Box className='flex justify-between items-center sidebar-header pli-5 plb-4 border-be'>
        <Typography variant='h5'>Schedule a Meeting</Typography>
        <IconButton size='small' onClick={handleAddEventSidebarToggle}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </Box>
      <PerfectScrollbar>
        <Box className='sidebar-body p-5'>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <FormControl fullWidth className='mbe-5'>
              <TextField
                label='Name'
                value={meetingDetails.name}
                onChange={e => setMeetingDetails({ ...meetingDetails, name: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth className='mbe-5'>
              <FormControl fullWidth className='mbe-5'>
                <InputLabel id='department-label'>Department</InputLabel>
                <Select
                  labelId='department-label'
                  value={meetingDetails.department}
                  onChange={e => setMeetingDetails({ ...meetingDetails, department: e.target.value })}
                  required
                >
                  <MenuItem value='Sales'>Sales</MenuItem>
                  <MenuItem value='Marketing'>Marketing</MenuItem>
                  <MenuItem value='Finance'>Finance</MenuItem>
                  <MenuItem value='Product'>Product</MenuItem>
                  <MenuItem value='Operations'>Operations</MenuItem>
                </Select>
              </FormControl>

            </FormControl>
            <FormControl fullWidth className='mbe-5'>
              <TextField
                label='Email'
                type='email'
                value={meetingDetails.email}
                onChange={e => setMeetingDetails({ ...meetingDetails, email: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth className='mbe-5'>
              <TextField
                label='Mobile'
                value={meetingDetails.mobile}
                onChange={e => setMeetingDetails({ ...meetingDetails, mobile: e.target.value })}
                required
              />
            </FormControl>
            <FormControl fullWidth className='mbe-5'>
              <TextField
                label='Business URL'
                value={meetingDetails.businessURL}
                onChange={e => setMeetingDetails({ ...meetingDetails, businessURL: e.target.value })}
              />
            </FormControl>
            <div className='mbe-5'>
              <AppReactDatepicker
                selected={meetingDetails.callbackTime}
                showTimeSelect
                dateFormat='yyyy-MM-dd hh:mm'
                customInput={<TextField fullWidth label='Callback Time' />}
                onChange={date => setMeetingDetails({ ...meetingDetails, callbackTime: date })}
              />
            </div>
            <Button type='submit' variant='contained' fullWidth>
              Schedule Meeting
            </Button>
          </form>
        </Box>
      </PerfectScrollbar>
    </Drawer>
  )
}

export default AddEventSidebar
