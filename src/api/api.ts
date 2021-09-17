const BASE_URL = 'https://www.omdbapi.com/?apikey=43371f3e&';

export const loadMovie = async (title = 'See') => {
  const response = await fetch(`${BASE_URL}&t=${title}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
};
