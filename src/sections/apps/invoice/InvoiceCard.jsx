import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// ==============================|| INVOICE - CARD ||============================== //

const InvoiceCard = ({ availableServices }) => {
  return (
    <MainCard title= "Available Services" sx={{ height: '100%' }}>
      <Grid container spacing={3}>
        {availableServices.map((service) => (
          <Grid key={service._id} item xs={12} sm={6} md={4}>
            <MainCard content={false} sx={{ py: 2.5 }}>
              <Stack alignItems="center" spacing={2}>
                <Avatar size="lg" type="filled" sx={{ borderRadius: "10px" }}>
                  <img src={service.image} alt={service.serviceName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Avatar>
                <Typography variant="subtitle1" color="text.secondary">
                  {service.serviceName}
                </Typography>
              </Stack>
            </MainCard>
          </Grid>
        ))}
      </Grid>
    </MainCard>
  );
};

InvoiceCard.propTypes = {
  availableServices: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      serviceName: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default InvoiceCard;


// import React from 'react';
// import PropTypes from 'prop-types';
// import Grid from '@mui/material/Grid';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import MainCard from 'components/MainCard';
// import Avatar from 'components/@extended/Avatar';

// const InvoiceCard = ({ availableServices }) => {
//   return (
//     <MainCard title="Available Services" sx={{ height: '100%' }}>
//       <Grid container spacing={3}>
//         {availableServices.map((service) => (
//           <Grid key={service._id} item xs={12} sm={6} md={4}>
//             {/* <MainCard content={false} sx={{ py: 2.5 }}> */}
//               <Stack alignItems="center" spacing={2}>
//                 {/* Stack for image and text */}
//                 <Stack direction="row" alignItems="center" spacing={2}>
//                   <Avatar size="lg" type="filled" sx={{ borderRadius: "10px" }}>
//                     <img src={service.image} alt={service.serviceName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
//                   </Avatar>
//                   <Typography variant="subtitle2" color="text.secondary">
//                     {service.serviceName}
//                   </Typography>
//                 </Stack>
//               </Stack>
//             {/* </MainCard> */}
//           </Grid>
//         ))}
//       </Grid>
//     </MainCard>
//   );
// };

// InvoiceCard.propTypes = {
//   availableServices: PropTypes.arrayOf(
//     PropTypes.shape({
//       _id: PropTypes.string.isRequired,
//       serviceName: PropTypes.string.isRequired,
//       image: PropTypes.string.isRequired,
//     })
//   ).isRequired,
// };

// export default InvoiceCard;
