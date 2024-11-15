import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'utils/axios';
// Material-UI components
import { useTheme } from '@mui/material/styles';
import {
  Tooltip,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
// Third-party
import Papa from 'papaparse';
import { DocumentUpload } from 'iconsax-react';

export default function CSVImportExport({ onImport }) {
  const theme = useTheme();
  const fileInputRef = useRef(null); // Create a ref for the file input
  const [importedData, setImportedData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [openResultsDialog, setOpenResultsDialog] = useState(false);
  const [uploadedData, setUploadedData] = useState([]);
  const [duplicateData, setDuplicateData] = useState([]);

  // Handle CSV import and parse data
  const handleCSVAction = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setImportedData(result.data); // Set parsed data
          setOpenPreviewDialog(true); // Open preview dialog
          fileInputRef.current.value = ''; // Reset file input after parsing
        },
      });
    }
  };

  const transformedData = importedData.map((row) => {
    const { 'Membership Number': memberShipNumber, ...rest } = row;
    return {
        memberShipNumber, // Renamed key
      ...rest
    };
  });


  // Upload data to server
  const handleUploadData = async () => {
    try {
      const response = await axios.post('/v1/memberShipNumber/addMultipleNumbers', {
        csvData: transformedData,
      });
      
      setUploadedData(response.data.data.insertedData);
      setDuplicateData(response.data.data.duplicateData);
      setUploadStatus('Data uploaded successfully!');
      setOpenPreviewDialog(false); // Close preview dialog
      setOpenResultsDialog(true); // Open results dialog to show uploaded data

      if (onImport) {
        onImport(response.data); // Pass server response to onImport callback
      }
    } catch (error) {
      setUploadStatus('Failed to upload data.');
      console.error('Error uploading data:', error);
    }
  };

  // Reset state for a new upload
  const resetState = () => {
    setImportedData([]);
    setUploadedData([]);
    setDuplicateData([]);
    setUploadStatus(null);
    setOpenPreviewDialog(false);
    setOpenResultsDialog(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* CSV Import */}
      <Tooltip title="CSV Import">
  <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
    <DocumentUpload
      size={28}
      variant="Outline"
      style={{
        color: theme.palette.text.secondary,
        marginTop: 4,
        marginRight: 4,
        marginLeft: 4,
      }}
    />
    <input
      type="file"
      accept=".csv"
      ref={fileInputRef} // Attach ref to file input
      onChange={handleCSVAction}
      style={{ display: 'none' }} // Hide the actual file input
    />
  </label>
</Tooltip>


      {/* Upload Status */}
      {uploadStatus && (
        <Typography variant="subtitle2" color="textSecondary">
          {uploadStatus}
        </Typography>
      )}

      {/* Data Preview Dialog */}
      <Dialog open={openPreviewDialog} onClose={resetState} fullWidth maxWidth="md">
      <DialogTitle style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
  CSV Data Preview
</DialogTitle>

        <DialogContent>
          {importedData.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {Object.keys(importedData[0]).map((key) => (
                      <TableCell key={key}>{key}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {importedData.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, idx) => (
                        <TableCell key={idx}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2">No data to display</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={resetState} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUploadData} color="primary" variant="contained">
            Upload Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* Display Uploaded and Duplicate Data */}
      <Dialog open={openResultsDialog} onClose={resetState} fullWidth maxWidth="md">
        <DialogTitle style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Uploaded Results
</DialogTitle>
        <DialogContent>
          {uploadedData.length > 0 && (
            <>
              <Typography variant="h4" style={{ margin: '10px' ,  fontWeight: 'bold'  }}>Successfully Uploaded Data</Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>membershipNumber</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {uploadedData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.memberShipNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          {duplicateData.length > 0 && (
            <>
              <Typography variant="h4" style={{ margin: '10px' ,  fontWeight: 'bold'  }}>Duplicate Data</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>membershipNumber</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {duplicateData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.memberShipNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
      {duplicateData.length === 0 && uploadedData.length === 0 && (
  <>
    <Typography variant="" style={{ margin: '10px', fontWeight: 'bold' }}>
      No data uploaded due to invalid format
    </Typography>
  </>
)}

        </DialogContent>
        <DialogActions>
          <Button onClick={resetState} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

CSVImportExport.propTypes = {
  onImport: PropTypes.func, // Callback to handle server response after import
};
