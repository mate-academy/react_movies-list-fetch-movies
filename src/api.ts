const BASE_URL = 'https://www.omdbapi.com/?apikey=d9ae6fa8';

export const getMovie = (title: string) => {
  return fetch(`${BASE_URL}&t=${title}`)
    .then(response => response.json());
};
