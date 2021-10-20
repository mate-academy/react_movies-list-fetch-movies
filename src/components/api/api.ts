const BASE_URL = 'http://www.omdbapi.com/?apikey=f3c39190&';

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
    throw new Error("Can't find a movie with such a title");
  }

  return movie as Movie;
};
