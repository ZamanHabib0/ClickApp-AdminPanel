import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import axios from 'axios';
import { fetcher } from 'utils/axios';

const baseUrl = import.meta.env.VITE_APP_API_URL;

const initialState = {
  modal: false
};

export const endpoints = {
  key: 'api/customer',
  modal: '/modal',
  insert: '/insert',
  update: '/update',
  delete: '/delete'
};

export function useGetCustomer() {
  const { data, error, isValidating } = useSWR(`${baseUrl}/v1/offerCard/getAllOfferCard`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      customers: data?.data || [],
      customersLoading: !error && !data,
      customersError: error,
      customersValidating: isValidating,
      customersEmpty: !data?.data?.length
    }),
    [data, error, isValidating]
  );

  return memoizedValue;
}

export async function insertOffer(newCustomer) {
  try {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await axios.post(`${baseUrl}/v1/vendor/addVendorOffer`, newCustomer, config);

    console.log('Insert Offer Response:', response.data); // Debugging log

    mutate(`${baseUrl}/v1/vendor/getAllOffersAdmin`, (currentData) => {
      return {
        ...currentData,
        data: {
          ...currentData.data,
          offers: [...currentData.data.offers, response.data.data]
        }
      };
    }, false);

    return response.data;
  } catch (error) {
    console.error('Error registering vendor:', error);
    throw error;
  }
}

export async function updateOffer(offerId, updatedCustomer) {
 
  if (updatedCustomer.image) {
    const imageData = new FormData();
    imageData.append('image', updatedCustomer.image);
  }


  try {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await axios.post(`${baseUrl}/v1/vendor/${offerId}/updateVendorOffer`, updatedCustomer, config);

    console.log('Update Offer Response:', response.data); // Debugging log

    mutate(`${baseUrl}/v1/vendor/getAllOffersAdmin`, (currentData) => {
      const updatedOffers = currentData.data.offers.map((offer) =>
        offer._id === offerId ? response.data.data : offer
      );
      return {
        ...currentData,
        data: {
          ...currentData.data,
          offers: updatedOffers
        }
      };
    }, false);

    return response.data;
  } catch (error) {
    console.error('Error updating vendor:', error);
    throw error;
  }
}

export async function deleteOffer(customerId) {
  try {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.delete(`${baseUrl}/v1/vendor/${customerId}/deleteOffer`, config);

    console.log('Delete Offer Response:', response.data); // Debugging log

    mutate(`${baseUrl}/v1/vendor/getAllOffersAdmin`, (currentData) => {
      const remainingOffers = currentData.data.offers.filter((offer) => offer._id !== customerId);
      return {
        ...currentData,
        data: {
          ...currentData.data,
          offers: remainingOffers
        }
      };
    }, false);

    return response.data;
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
    (currentCustomermaster) => {
      return { ...currentCustomermaster, modal };
    },
    false
  );
}