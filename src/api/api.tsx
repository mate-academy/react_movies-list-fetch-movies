const BASE_URL = 'https://www.omdbapi.com/?apikey=97702b01&';

const request = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

export const getMovie = async (title: string) => {
  const movie = await request(`t=${title}`);

  if (movie.Response === 'False') {
    throw new Error('Cannot find a movie');
  }

  return movie as Movie;
};
