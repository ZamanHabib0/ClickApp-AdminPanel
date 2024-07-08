import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_APP_API_URL;

// utils
import { fetcher } from 'utils/axios';

const initialState = {
  modal: false
};

export const endpoints = {
  key: 'api/customer',
  list: '/list', // server URL
  modal: '/modal', // server URL
  insert: '/insert', // server URL
  update: '/update', // server URL
  delete: '/delete' // server URL
};

export function useGetCustomer() {
  const { data, error, isValidating } = useSWR(`${baseUrl}/v1/adminpanel/getFeedback`, fetcher, {
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

export async function deleteCustomer(customerId) {
  try {
    const token = localStorage.getItem('authToken');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.delete(`${baseUrl}/v1/adminpanel/${customerId}/deleteFeedback`, config);

    mutate(`${baseUrl}/v1/adminpanel/getFeedback`, (currentCustomer) => {
      const remainingCustomers = currentCustomer.data.filter((customer) => customer._id !== customerId);
      return {
        ...currentCustomer,
        data: remainingCustomers
      };
    }, false);

    return response.data;
  } catch (error) {
    console.error('Error deleting feedback:', error);
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
