import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import axios from 'axios';
import { fetcher } from 'utils/axios';

const initialState = {
  modal: false
};

const baseUrl = import.meta.env.VITE_APP_API_URL;

export const endpoints = {
  key: 'api/customer',
  list: '/list', // server URL
  modal: '/modal', // server URL
  insert: '/insert', // server URL
  update: '/update', // server URL
  delete: '/delete' // server URL
};

export function useGetCustomer() {
  const { data, error, isValidating } = useSWR(`${baseUrl}/v1/vendor/getVendorAdmin?limit=9999&page=1`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      customers: data?.data.vendors || [],  // Adjust based on the structure of your response
      customersLoading: !error && !data,
      customersError: error,
      customersValidating: isValidating,
      customersEmpty: !data?.data?.vendors?.length
    }),
    [data, error, isValidating]
  );

  return memoizedValue;
}

export async function insertCustomer(newCustomer) {
  try {
    const token = localStorage.getItem('authToken');

    const imageapi = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    // Image upload
    const imageData = new FormData();
    imageData.append('image', newCustomer.image);
    const Imageresponse = await axios.post(`${baseUrl}/v1/api/imageUpload`, imageData, imageapi);

    let galleryImagesresponse = { data: { data: [] } };
    if (newCustomer.gallery.length > 0) {
      const multiImagesGallery = new FormData();
      newCustomer.gallery.forEach(file => {
        multiImagesGallery.append('images', file);
      });
      galleryImagesresponse = await axios.post(`${baseUrl}/v1/api/imageUploadMulti`, multiImagesGallery, imageapi);
    }

    let menuImagesresponse = { data: { data: [] } };
    if (newCustomer.menu.length > 0) {
      const multiImagesMenu = new FormData();
      newCustomer.menu.forEach(file => {
        multiImagesMenu.append('images', file);
      });
      menuImagesresponse = await axios.post(`${baseUrl}/v1/api/imageUploadMulti`, multiImagesMenu, imageapi);
    }

    newCustomer.logo = Imageresponse.data.data.url;
    newCustomer.gallery = galleryImagesresponse.data.data;
    newCustomer.menu = menuImagesresponse.data.data;

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.post(`${baseUrl}/v1/vendor/registerVendor`, newCustomer, config);

    mutate(`${baseUrl}/v1/vendor/getVendorAdmin?limit=9999&page=1`);

    return response.data;
  } catch (error) {
    console.error('Error registering vendor:', error);
    throw error;
  }
}


export async function updateCustomer(customerId, updatedCustomer) {
  try {
    const token = localStorage.getItem('authToken');
    
    // Define headers for image uploads
    const imageapi = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    // Update logo image if present
    if (updatedCustomer.image) {
      const imageData = new FormData();
      imageData.append('image', updatedCustomer.image);
      const Imageresponse = await axios.post(`${baseUrl}/v1/api/imageUpload`, imageData, imageapi);
      updatedCustomer.logo = Imageresponse.data.data.url;
    }

    // Update gallery images if present
    if (updatedCustomer.gallery.length > 0) {
      const multiImagesGallery = new FormData();
      updatedCustomer.gallery.forEach(file => {
        multiImagesGallery.append('images', file);
      });
      const galleryImagesresponse = await axios.post(`${baseUrl}/v1/api/imageUploadMulti`, multiImagesGallery, imageapi);
      
      const galleryCombinedArray = updatedCustomer.galleryImages.concat(galleryImagesresponse.data.data);
      updatedCustomer.galleryImages = galleryCombinedArray;
    }

    // Update menu images if present
    if (updatedCustomer.menu.length > 0) {
      const multiImagesMenu = new FormData();
      updatedCustomer.menu.forEach(file => {
        multiImagesMenu.append('images', file);
      });
      const menuImagesresponse = await axios.post(`${baseUrl}/v1/api/imageUploadMulti`, multiImagesMenu, imageapi);
      
      const menuCombinedArray = updatedCustomer.menuImages.concat(menuImagesresponse.data.data);
      updatedCustomer.menuImages = menuCombinedArray;
    }

    // Assign updated arrays back to original properties
    updatedCustomer.gallery = updatedCustomer.galleryImages;
    updatedCustomer.menu = updatedCustomer.menuImages;

    // Define headers for customer update request
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    // Perform customer update request
    const response = await axios.post(`${baseUrl}/v1/vendor/${customerId}/updateVendor`, updatedCustomer, config);

    // Invalidate cached data
    mutate(`${baseUrl}/v1/vendor/getVendorAdmin?limit=9999&page=1`);

    return response.data;
  } catch (error) {
    console.error('Error updating vendor:', error);
    throw error;
  }
}


export async function deleteCustomer(vendorId) {
  try {
    const token = localStorage.getItem('authToken');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.delete(`${baseUrl}/v1/vendor/${vendorId}/delete`, config);

    if (response.status === 200) {
      mutate(`${baseUrl}/v1/vendor/getVendorAdmin?limit=9999&page=1`, (currentData) => ({
        ...currentData,
        data: {
          ...currentData.data,
          vendors: currentData.data.vendors.filter((customer) => customer._id !== vendorId)
        }
      }), false);
    }
  } catch (error) {
    console.error('Error deleting vendor:', error);
    throw error;
  }
}


export function useGetCustomerMaster() {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.modal, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      customerMaster: data,
      customerMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerCustomerDialog(modal) {
  mutate(
    endpoints.key + endpoints.modal,
    (currentCustomermaster) => ({ ...currentCustomermaster, modal }),
    false
  );
}
