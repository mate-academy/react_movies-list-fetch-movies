import { BASE_URL } from '../constants';

export const getData = async <T>(title: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${title}`);

  return response.json();
};
