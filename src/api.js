const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=dac0c304';

export const getMovie = (movie) => {
  return fetch(`${BASE_URL}&t=${movie}`)
    .then(response => {
      return response.ok
        ? response.json()
        : Promise.reject(new Error('error'));
    });
};
