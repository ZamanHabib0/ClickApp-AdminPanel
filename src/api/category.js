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
  const { data, error, isValidating } = useSWR(`${baseUrl}/v1/category/getCategories?page=1&limit=9999`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      customers: data?.data.categories || [],  // Adjust based on the structure of your response
      customersLoading: !error && !data,
      customersError: error,
      customersValidating: isValidating,
      customersEmpty: !data?.data?.categories?.length
    }),
    [data, error, isValidating]
  );

  return memoizedValue;
}

export async function insertCustomer(newCustomer) {
  try {
    const token = localStorage.getItem('authToken');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const formData = new FormData();
    for (const key in newCustomer) {
      formData.append(key, newCustomer[key]);
    }

    const response = await axios.post(`${baseUrl}/v1/category/addCategory`, formData, config);

    mutate(
      `${baseUrl}/v1/category/getCategories?page=1&limit=9999`,
      (currentData) => ({
        ...currentData,
        data: {
          ...currentData.data,
          categories: [...currentData.data.categories, response.data.data]
        }
      }),
      false
    );

    return response.data;
  } catch (error) {
    console.error('Error registering vendor:', error);
    throw error;
  }
}

export async function updateCustomer(categoryId, updatedCustomer) {
  try {
    const token = localStorage.getItem('authToken');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const formData = new FormData();
    for (const key in updatedCustomer) {
      formData.append(key, updatedCustomer[key]);
    }

    const response = await axios.post(`${baseUrl}/v1/category/${categoryId}/updateCategory`, formData, config);

    mutate(
      `${baseUrl}/v1/category/getCategories?page=1&limit=9999`,
      (currentData) => ({
        ...currentData,
        data: {
          ...currentData.data,
          categories: currentData.data.categories.map((customer) =>
            customer._id === categoryId ? { ...customer, ...response.data.data } : customer
          )
        }
      }),
      false
    );

    return response.data;
  } catch (error) {
    console.error('Error updating vendor:', error);
    throw error;
  }
}

export async function deleteCustomer(categoryId) {
  try {
    const token = localStorage.getItem('authToken');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    await axios.delete(`${baseUrl}/v1/category/${categoryId}/deleteCategory`, config);

    mutate(
      `${baseUrl}/v1/category/getCategories?page=1&limit=9999`,
      (currentData) => ({
        ...currentData,
        data: {
          ...currentData.data,
          categories: currentData.data.categories.filter((customer) => customer._id !== categoryId)
        }
      }),
      false
    );
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
