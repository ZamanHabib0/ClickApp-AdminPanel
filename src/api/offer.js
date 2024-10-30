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

export function useGetCustomer({ vendorId }) {
  const { data, error, isValidating } = useSWR(`${baseUrl}/v1/vendor/${vendorId}/getOfferofVendor`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(() => {
    const offers = data?.data?.offers || [];

    return {
      customers: offers,
      customersLoading: !error && !data,
      customersError: error,
      customersValidating: isValidating,
      customersEmpty: offers.length === 0
    };
  }, [data, error, isValidating]);

  return memoizedValue;
}

// Insert Offer
export async function insertOffer(newCustomer) {
  try {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await axios.post(`${baseUrl}/v1/vendor/addVendorOffer`, newCustomer, config);

    mutate(`${baseUrl}/v1/vendor/getAllOffersAdmin`, (currentData) => ({
      ...currentData,
      data: {
        ...currentData.data,
        offers: [...currentData.data.offers, response.data.data]
      }
    }), false);

    return response.data;
  } catch (error) {
    console.error('Error registering vendor:', error);
    throw error;
  }
}

// Update Offer
// Update Offer
export async function updateOffer(offerId, updatedCustomer) {
  try {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await axios.post(`${baseUrl}/v1/vendor/${offerId}/updateVendorOffer`, updatedCustomer, config);

    // Use `mutate` to update the cache
    mutate(`${baseUrl}/v1/vendor/getAllOffersAdmin`, (currentData) => {
      // Map over the current offers to replace the updated offer
      const updatedOffers = currentData.data.offers.map((offer) =>
        offer._id === offerId ? response.data.data : offer // Replace the updated offer
      );

      // Return the new data structure with updated offers
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


// Delete Offer
export async function deleteOffer(customerId) {
  try {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    await axios.delete(`${baseUrl}/v1/vendor/${customerId}/deleteOffer`, config);

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
