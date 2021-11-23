const BASE_URL = 'https://www.omdbapi.com/?apikey=bb703082&t';

export const request = (title: string) => {
  return fetch(`${BASE_URL}=${title}`)
    .then((response) => response.json());
};

export const getMovie = (title: string) => request(title);
