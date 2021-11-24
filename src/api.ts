const BASE_URL = 'https://www.omdbapi.com/?apikey=2e742e04&t=';

export const getMovie = async (title: string) => {
  const response = await fetch(`${BASE_URL}${title}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
};
