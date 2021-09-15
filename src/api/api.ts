const BASE_URL = 'https://www.omdbapi.com/?apikey=99fbe74e&';

export const getMovie = (title: string) => {
  return fetch(`${BASE_URL}&t=${title}`)
    .then(response => response.json());
};
