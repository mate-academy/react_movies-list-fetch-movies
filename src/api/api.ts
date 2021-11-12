const BASE_URL = 'https://www.omdbapi.com/?apikey=';
const apiKey = 'e7eaf18f';

export const request = (searchQuery: string) => {
  return fetch(`${BASE_URL}${apiKey}&t=${searchQuery}`)
    .then(result => {
      if (!result.ok) {
        throw new Error(`${result.status}-${result.statusText}`);
      }

      return result.json();
    });
};

export const requestArr = (searchQuery: string) => {
  return fetch(`${BASE_URL}${apiKey}&s=${searchQuery}`)
    .then(result => {
      if (!result.ok) {
        throw new Error(`${result.status}-${result.statusText}`);
      }

      return result.json();
    });
};
