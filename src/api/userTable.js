import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import axios from 'axios';
import { fetcher, fetcherPost } from 'utils/axios';

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
  const { data, error, isValidating } = useSWR(`${baseUrl}/v1/offerCard/getAllUsersWithOfferCards`, fetcher, {
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


    mutate(`${baseUrl}/v1/vendor/getAllOffersAdmin` , fetcher ,(currentData) => {
      const remainingOffers = currentData.data.offers.filter((offer) => offer._id !== customerId);
      return {
        ...currentData,
        data: {
          ...currentData.data,
          offers: remainingOffers
        }
      };
    }, false);

    return response.data.data;
  } catch (error) {
    console.error('Error deleting vendor:', error);
    throw error;
  }
}

export async function userManagement(userId, updatedData) {
  try {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    // Make the API call to update the user
    const response = await axios.post(`${baseUrl}/v1/authAdmin/userManagement/${userId}`, updatedData, config);

    if (response.data.error === false) {
      const updatedUser = response.data.data;  // This should be the user object that is updated
      const updatedOfferCard = response.data.updatedOfferCard; // Assuming this is the updated offer card

      // Update the SWR cache for the users
      mutate(`${baseUrl}/v1/offerCard/getAllUsersWithOfferCards`, fetcher,(currentData) => {
        if (!currentData || !currentData.data) return currentData;

        const updatedCustomers = currentData.data.map((customer) =>
          customer._id === updatedUser._id
            ? { ...customer, ...updatedUser, offerCard: updatedOfferCard }
            : customer
        );

        return {
          ...currentData,
          data: updatedCustomers
        };
      }, false); // No revalidation, just cache update

    } else {
      console.error('User update failed:', response.data.msg);
      throw new Error(response.data.msg);
    }
  } catch (error) {
    console.error('Error updating user:', error);
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


export async function deleteUser(userId) {
  try {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.delete(`${baseUrl}/v1/authAdmin/deleteUserByAdmin/${userId}`, config);


    mutate(`${baseUrl}/v1/offerCard/getAllUsersWithOfferCards`, fetcher,(currentData) => {
      if (!currentData || !currentData.data) return currentData;

      const updatedCustomers = currentData.data.map((customer) =>
        customer._id === updatedUser._id
          ? { ...customer, ...updatedUser, offerCard: updatedOfferCard }
          : customer
      );

      return {
        ...currentData,
        data: updatedCustomers
      };
    }, false); // No revalidation, just cache update

    return response.data.data;
  } catch (error) {
    console.error('Error deleting vendor:', error);
    throw error;
  }
}

