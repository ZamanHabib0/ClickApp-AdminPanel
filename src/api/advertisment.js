import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_APP_API_URL;

// utils
import { fetcher } from 'utils/axios';

const initialState = {
  modal: false,
};

export const endpoints = {
  key: 'api/customer',
  list: '/list', // server URL
  modal: '/modal', // server URL
  insert: '/insert', // server URL
  update: '/update', // server URL
  delete: '/delete', // server URL
};

export function useGetCustomer() {
  const { data, error, isValidating } = useSWR(`${baseUrl}/v1/advertisement/adminpanel`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const memoizedValue = useMemo(
    () => ({
      customers: data?.data || [],
      customersLoading: !error && !data,
      customersError: error,
      customersValidating: isValidating,
      customersEmpty: !data?.data?.length,
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
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await axios.post(`${baseUrl}/v1/advertisement/createAdvertisment`, newCustomer, config);

    mutate(
      `${baseUrl}/v1/advertisement/adminpanel`,
      (currentCustomer) => {
        if (!currentCustomer) return { data: [response.data.data] };
        return {
          ...currentCustomer,
          data: [...currentCustomer.data, response.data.data],
        };
      },
      false
    );

    return response.data;
  } catch (error) {
    console.error('Error registering vendor:', error);
    throw error;
  }
}

export async function updateCustomer(customerId, updatedCustomer) {
  try {
    const token = localStorage.getItem('authToken');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await axios.post(`${baseUrl}/v1/advertisement/${customerId}/updateAdvertisements`, updatedCustomer, config);

    mutate(`${baseUrl}/v1/advertisement/adminpanel`, (currentCustomer) => {
      if (!currentCustomer) return { data: [response.data.data] };
      
      const updatedCustomers = (currentCustomer.data || []).map((customer) =>
        customer._id === customerId ? response.data.data : customer
      );

      return {
        ...currentCustomer,
        data: updatedCustomers,
      };
    }, false);

    return response.data;
  } catch (error) {
    console.error('Error updating vendor:', error);
    throw error;
  }
}

export async function deleteCustomer(customerId) {
  try {
    const token = localStorage.getItem('authToken');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    await axios.delete(`${baseUrl}/v1/advertisement/${customerId}/deleteAdvertisements`, config);

    mutate(`${baseUrl}/v1/advertisement/adminpanel`, (currentCustomer) => {
      const nonDeletedCustomers = (currentCustomer?.data || []).filter((customer) => customer._id !== customerId);

      return {
        ...currentCustomer,
        data: nonDeletedCustomers,
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
    revalidateOnReconnect: false,
  });

  const memoizedValue = useMemo(
    () => ({
      customerMaster: data,
      customerMasterLoading: isLoading,
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerCustomerDialog(modal) {
  mutate(
    endpoints.key + endpoints.modal,
    (currentCustomerMaster) => {
      return { ...currentCustomerMaster, modal };
    },
    false
  );
}
