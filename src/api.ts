const BASE_URL = 'http://www.omdbapi.com/?apikey=3736f502&t=';

export const getMovie = (title: string) => {
  return fetch(`${BASE_URL}[${title}]`)
    .then(response => response.json());
};

export {};
