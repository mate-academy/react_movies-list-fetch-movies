const BASE_URL = 'https://www.omdbapi.com/?apikey=340ee6ae&t=';

export const getMovie = async (title: string) => {
  const response = await fetch(`${BASE_URL}${title}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  const movie = await response.json();

  return movie;
};
