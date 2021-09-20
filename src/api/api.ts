export const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=fffac0ac';

export const getNewMovie = (title: string) => {
  return fetch(`${BASE_URL}&t=${title}`)
    .then(response => response.json());
};
