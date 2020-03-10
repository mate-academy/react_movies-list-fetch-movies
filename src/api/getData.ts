const BASE_URL = 'https://www.omdbapi.com/?apikey=7246e96f&t=';

export const getData = async <T>(title: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${title}`);

  return response.json();
};
