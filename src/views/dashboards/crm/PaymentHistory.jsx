'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { useColorScheme } from '@mui/material/styles'
import { useSession } from 'next-auth/react';

// Third-party Imports
import classnames from 'classnames'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// API URL & Vendor ID (Replace with actual values)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PaymentHistory = ({ serverMode }) => {
  const { data: session } = useSession();
  const vendorId = session?.user?.id;
  const { mode } = useColorScheme()
  const [data, setData] = useState([])

  // Fetch data from API
  useEffect(() => {
    if (!vendorId) return;
    
    const fetchData = async () => {

      try {
        const response = await fetch(`${API_URL}/vendor/fetchbookingsbyvendorid/${vendorId}`)

        const result = await response.json()

        if (result.bookings) {
          const formattedData = result.bookings.map(booking => ({
            vehicleNumber: `#${booking.vehicleNumber}`,// Duration
            spend: `+₹${booking.amount}`, // Amount spent
            balance: `${booking.hour} Hours`, // Duration
            date: `${booking.exitDate} | ${booking.exitTime}`, // Exit date & time
            imgName: 'visa' // Keeping static card icon (modify if needed)

          }))

          setData(formattedData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)

      }
    }

    fetchData()
  }, [vendorId])

  // Vars
  const _mode = (mode === 'system' ? serverMode : mode) || serverMode

  return (
    <Card>
      <CardHeader
        title='Payment History'
      />
      <div className='overflow-x-auto pbe-3'>
        <table className={tableStyles.table}>
          <thead className='uppercase'>
            <tr className='border-be'>

              <th className='bg-transparent bs-11 font-normal'>Vehicle Number</th>

              <th className='bg-transparent bs-11 text-center font-normal'>Date</th>
              <th className='bg-transparent bs-11 text-end font-normal'>Spend</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className='border-0'>
                <td>
                  <div className='flex items-center gap-4'>
                    <Avatar
                      variant='rounded'
                      className={classnames('is-[50px] bs-[30px]', {
                        'bg-white': _mode === 'dark',
                        'bg-actionHover': _mode === 'light'
                      })}
                    >
                      <img width={30} alt={row.imgName} src={`/images/logos/${row.imgName}.png`} />
                    </Avatar>
                    <div className='flex flex-col'>
                      <Typography color='text.primary' className='font-medium'>
                        {row.vehicleNumber}
                      </Typography>
                    </div>
                  </div>
                </td>
                <td className='text-center'>
                  <Typography variant='body2'>{row.date}</Typography>
                </td>
                <td className='text-end'>
                  <div className='flex flex-col'>
                    <Typography color='text.primary' className='font-medium'>
                      {row.spend}
                    </Typography>
                    <Typography variant='body2'>{row.balance}</Typography>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </Card>
  )
}

export default PaymentHistory

// // MUI Imports
// import Card from '@mui/material/Card'
// import CardHeader from '@mui/material/CardHeader'
// import Typography from '@mui/material/Typography'
// import Avatar from '@mui/material/Avatar'
// import { useColorScheme } from '@mui/material/styles'

// // Third-party Imports
// import classnames from 'classnames'

// // Components Imports
// import OptionMenu from '@core/components/option-menu'

// // Style Imports
// import tableStyles from '@core/styles/table.module.css'

// // Vars
// const data = [
//   {
//     spend: '-$2,820',
//     balance: '$10,450',
//     cardType: 'Credit Card',
//     cardNumber: '*4399',
//     imgName: 'visa',
//     date: '05/Jan'
//   },
//   {
//     spend: '-$345',
//     balance: '$8,709',
//     cardType: 'Debit Card',
//     cardNumber: '*5545',
//     imgName: 'mastercard',
//     date: '12/Feb'
//   },
//   {
//     spend: '-$2,820',
//     balance: '$10,450',
//     cardType: 'ATM Card',
//     cardNumber: '*9860',
//     imgName: 'american-express',
//     date: '24/Feb'
//   },
//   {
//     spend: '-$2,820',
//     balance: '$10,450',
//     cardType: 'Credit Card',
//     cardNumber: '*4300',
//     imgName: 'visa',
//     date: '08/Mar'
//   },
//   {
//     spend: '-$2,820',
//     balance: '$10,450',
//     cardType: 'Debit Card',
//     cardNumber: '*5545',
//     imgName: 'mastercard',
//     date: '15/Apr'
//   },
//   {
//     spend: '-$2,820',
//     balance: '$10,450',
//     cardType: 'Credit Card',
//     cardNumber: '*4399',
//     imgName: 'visa',
//     date: '28/Apr'
//   }
// ]

// const PaymentHistory = ({ serverMode }) => {
//   // Hooks
//   const { mode } = useColorScheme()

//   // Vars
//   const _mode = (mode === 'system' ? serverMode : mode) || serverMode

//   return (
//     <Card>
//       <CardHeader
//         title='Payment History'
//         action={<OptionMenu options={['Last 28 Days', 'Last Month', 'Last Year']} />}
//       />
//       <div className='overflow-x-auto pbe-3'>
//         <table className={tableStyles.table}>
//           <thead className='uppercase'>
//             <tr className='border-be'>
//               <th className='bg-transparent bs-11 font-normal'>Card</th>
//               <th className='bg-transparent bs-11 text-center font-normal'>Date</th>
//               <th className='bg-transparent bs-11 text-end font-normal'>Spend</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, index) => (
//               <tr key={index} className='border-0'>
//                 <td>
//                   <div className='flex items-center gap-4'>
//                     <Avatar
//                       variant='rounded'
//                       className={classnames('is-[50px] bs-[30px]', {
//                         'bg-white': _mode === 'dark',
//                         'bg-actionHover': _mode === 'light'
//                       })}
//                     >
//                       <img width={30} alt={row.imgName} src={`/images/logos/${row.imgName}.png`} />
//                     </Avatar>
//                     <div className='flex flex-col'>
//                       <Typography color='text.primary' className='font-medium'>
//                         {row.cardNumber}
//                       </Typography>
//                       <Typography variant='body2'>{row.cardType}</Typography>
//                     </div>
//                   </div>
//                 </td>
//                 <td className='text-center'>
//                   <Typography variant='body2'>{row.date}</Typography>
//                 </td>
//                 <td className='text-end'>
//                   <div className='flex flex-col'>
//                     <Typography color='text.primary' className='font-medium'>
//                       {row.spend}
//                     </Typography>
//                     <Typography variant='body2'>{row.balance}</Typography>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </Card>
//   )
// }

// export default PaymentHistory
