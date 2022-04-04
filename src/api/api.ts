const BASE_URL = 'https://www.omdbapi.com/?apikey=65e33bea&t=';

export const getMovie = (endpoint: string) => {
  return fetch(`${BASE_URL}${endpoint}`)
    .then(response => {
      if (response.ok === undefined) {
        throw new Error(`${response.status} : ${response.statusText}`);
      }

      return response.json();
    })
    .then(response => {
      if (response.Error) {
        return null;
      }

      return response;
    });
};
