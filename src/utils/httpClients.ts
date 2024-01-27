const BASE_URL = 'https://www.omdbapi.com/?apikey=';
const API_KEY = 'd8bfbb3d';

export function getMovie(title: string) {
  return fetch(`${BASE_URL + API_KEY}&t=${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return response.json;
    });
}

// const BASE_URL = 'https://www.omdbapi.com/?apikey=[yourkey]&t=[title]';
// const key1 = 'http://www.omdbapi.com/?i=tt3896198&apikey=d8bfbb3d[title]';
