const API_KEY = '91e1c690';
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&t=`;

const request = (url: string) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};

export const getMovie = (searchMovie: string) => {
  return request(`${searchMovie}`);
};
