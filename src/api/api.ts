const BASE_URL = 'https://www.omdbapi.com/?apikey=86a44497';

export const getMovie = (title: string) => {
  return fetch(`${BASE_URL}&t=${title}`)
    .then(response => response.json());
};
