const BASE_URL = 'http://www.omdbapi.com';

export const request = async(url) => {
  const response = await fetch(`${BASE_URL}${url}`);

  return response.json();
};

export const getMovieByTitle = async(title) => {
  const movieRequest = await request(`/?apikey=512a403a&t=${title}`);

  return movieRequest;
};
