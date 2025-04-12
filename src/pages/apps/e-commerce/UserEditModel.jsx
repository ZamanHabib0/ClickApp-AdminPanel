import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import FormCustomerAdd from './editUserForm';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';



export default function CustomerModal({ open, modalToggler, customer }) {

  const closeModal = () => modalToggler(false);


  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-customer-add-label"
          aria-describedby="modal-customer-add-description"
          sx={{ '& .MuiPaper-root:focus': { outline: 'none' } }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar sx={{ maxHeight: `calc(100vh - 48px)`, '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
            <FormCustomerAdd customer={customer || null} closeModal={closeModal}/>

            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}

CustomerModal.propTypes = { open: PropTypes.bool, modalToggler: PropTypes.func, customer: PropTypes.any };
