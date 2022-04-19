const BASE_URL = 'https://www.omdbapi.com/?apikey=18d2cfad';

export const getData = (endpoint: string) => {
  return fetch(`${BASE_URL}${endpoint}`)
    .then(response => response.json());
};

export const getMovieByTitle = (title: string) => getData(`&t=${title}`);
