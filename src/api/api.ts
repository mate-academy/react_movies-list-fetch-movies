import { BASE_URL } from '../utils/constants';

export const getData = async <T>(url: string): Promise<T> => {
  const response = await fetch(BASE_URL + url);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json()
    .catch(error => {
      return error;
    });
};
