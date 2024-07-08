// src/api/membershupNumber.js
import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import { fetcher } from 'utils/axios';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_APP_API_URL;

export function useGetCustomer() {
  const { data, error, isValidating } = useSWR(`${baseUrl}/v1/memberShipNumber/getMemberShipNumbers`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      customers: data?.data || [],  // Adjust based on the structure of your response
      customersLoading: !error && !data,
      customersError: error,
      customersValidating: isValidating,
      customersEmpty: !data?.data?.length
    }),
    [data, error, isValidating]
  );

  return memoizedValue;
}

export async function deleteCustomer(memberShipNumberId) {
  try {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    await axios.delete(`${baseUrl}/v1/memberShipNumber/${memberShipNumberId}/delete`, config);

    mutate(
      `${baseUrl}/v1/memberShipNumber/getMemberShipNumbers`,
      (currentData) => {
        if (!currentData) return null;

        const updatedData = currentData.data.filter(customer => customer._id !== memberShipNumberId);
        return {
          ...currentData,
          data: updatedData
        };
      },
      false
    );
  } catch (error) {
    console.error('Error deleting vendor:', error);
    throw error;
  }
}
