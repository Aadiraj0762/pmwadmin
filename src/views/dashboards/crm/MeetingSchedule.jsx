// // MUI Imports
// import Card from '@mui/material/Card'
// import CardHeader from '@mui/material/CardHeader'
// import CardContent from '@mui/material/CardContent'
// import Typography from '@mui/material/Typography'
// import Chip from '@mui/material/Chip'

// // Components Imports
// import OptionMenu from '@core/components/option-menu'
// import CustomAvatar from '@core/components/mui/Avatar'

// // Vars
// const data = [
//   {
//     avatarSrc: '/images/avatars/4.png',
//     title: 'Call with Woods',
//     subtitle: '21 Jul | 08:20-10:30',
//     chipLabel: 'Business',
//     chipColor: 'primary'
//   },
//   {
//     avatarSrc: '/images/avatars/5.png',
//     title: 'Conference call',
//     subtitle: '24 Jul | 11:30-12:00',
//     chipLabel: 'Meditation',
//     chipColor: 'success'
//   },
//   {
//     avatarSrc: '/images/avatars/3.png',
//     title: 'Meeting with Mark',
//     subtitle: '28 Jul | 05:00-6:45',
//     chipLabel: 'Dinner',
//     chipColor: 'warning'
//   },
//   {
//     avatarSrc: '/images/avatars/2.png',
//     title: 'Meeting with Oakland',
//     subtitle: '03 Aug | 07:00-8:30',
//     chipLabel: 'Meetup',
//     chipColor: 'secondary'
//   },
//   {
//     avatarSrc: '/images/avatars/8.png',
//     title: 'Meeting in Oakland',
//     subtitle: '14 Aug | 04:15-05:30',
//     chipLabel: 'Dinner',
//     chipColor: 'error'
//   },
//   {
//     avatarSrc: '/images/avatars/7.png',
//     title: 'Meeting with Carl',
//     subtitle: '05 Oct | 10:00-12:45',
//     chipLabel: 'Business',
//     chipColor: 'primary'
//   }
// ]

// const Transactions = () => {
//   return (
//     <Card>
//       <CardHeader title='Meeting Schedule' action={<OptionMenu options={['Refresh', 'Share', 'Reschedule']} />} />
//       <CardContent className='flex flex-col gap-6'>
//         {data.map((item, index) => (
//           <div key={index} className='flex items-center gap-4'>
//             <CustomAvatar variant='rounded' src={item.avatarSrc} size={38} />
//             <div className='flex justify-between items-center is-full flex-wrap gap-x-4 gap-y-2'>
//               <div className='flex flex-col gap-0.5'>
//                 <Typography color='text.primary' className='font-medium'>
//                   {item.title}
//                 </Typography>
//                 <div className='flex items-center gap-2'>
//                   <i className='ri-calendar-line text-base text-textSecondary' />
//                   <Typography variant='body2'>{item.subtitle}</Typography>
//                 </div>
//               </div>
//               <Chip label={item.chipLabel} color={item.chipColor} size='small' variant='tonal' />
//             </div>
//           </div>
//         ))}
//       </CardContent>
//     </Card>
//   )
// }

// export default Transactions
'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import OptionMenu from '@core/components/option-menu';
import CustomAvatar from '@core/components/mui/Avatar';
import { useSession } from 'next-auth/react';

const badgeColors = {
  Sales: 'primary',
  Marketing: 'success',
  Finance: 'warning',
  Product: 'secondary',
  Operations: 'error',
};

// Mapping department to avatar images
const departmentAvatars = {
  Sales: '/images/avatars/4.png',
  Marketing: '/images/avatars/5.png',
  Finance: '/images/avatars/3.png',
  Product: '/images/avatars/2.png',
  Operations: '/images/avatars/8.png'
};


const Transactions = () => {
  const { data: session } = useSession();
  const vendorId = session?.user?.id;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    if (!vendorId) return;
    axios.get(`${API_URL}/vendor/fetchmeeting/${vendorId}`)
      .then(response => setMeetings(response.data.meetings))
      .catch(error => console.error('Error fetching meetings:', error));
  }, [vendorId]);

  return (
    <Card>
      <CardHeader title='Meeting Schedule'  />
      <CardContent className='flex flex-col gap-6'>
        {meetings.map((item) => (
          <div key={item._id} className='flex items-center gap-4'>
            <CustomAvatar
              variant='rounded'
              src={departmentAvatars[item.department] || '/images/avatars/placeholder.png'}
              size={38}
            />
            <div className='flex justify-between items-center w-full flex-wrap gap-x-4 gap-y-2'>
              <div className='flex flex-col gap-0.5'>
                <Typography color='text.primary' className='font-medium'>
                  {item.name}
                </Typography>
                <div className='flex items-center gap-2'>
                  <i className='ri-calendar-line text-base text-textSecondary' />
                  <Typography variant='body2'>
                    {new Date(item.callbackTime).toLocaleString()}
                  </Typography>
                </div>
              </div>
              <Chip label={item.department} color={badgeColors[item.department] || 'default'} size='small' variant='tonal' />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Transactions;
