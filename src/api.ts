const BASE_URL = 'http://www.omdbapi.com/?apikey=f26a7b2d';

export const fetchMovie = (endpoint: string) => {
  return fetch(`${BASE_URL}${endpoint}`)
    .then(response => response.json());
};

export const fetchMovieByTitle = (title: string) => fetchMovie(`&t=${title}`);
