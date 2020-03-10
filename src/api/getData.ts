const BASE_URL = 'https://www.omdbapi.com/?apikey=67f04d69&t=';

export const getData = async <T>(url: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`);

  return response.json();
};
