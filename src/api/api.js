const BASE_URL = 'http://www.omdbapi.com';
const myKey = 'c77ea3c8';

export const getMovieByTitle = async(title) => {
  const response = await fetch(`${BASE_URL}/?apikey=${myKey}&t=${title}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
};
