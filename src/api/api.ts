const BASE_URL = 'https://www.omdbapi.com/?apikey=5de94e75';

export const getData = async (title: string) => {
  const response = await fetch(`${BASE_URL}&t=${title}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
};
