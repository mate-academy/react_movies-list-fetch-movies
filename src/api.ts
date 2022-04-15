const BASE_URL = 'http://www.omdbapi.com/?apikey=18d2cfad&t=';

export const getData = (title: string) => {
  return fetch(`${BASE_URL}${title}`)
    .then(response => response.json());
};
