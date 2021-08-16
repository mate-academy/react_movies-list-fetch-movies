const BASE_URL = 'http://www.omdbapi.com';
const myKey = '512a403a';

export const getMovieByTitle = async(title) => {
  const response = await fetch(`${BASE_URL}/?apikey=${myKey}&t=${title}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
};
