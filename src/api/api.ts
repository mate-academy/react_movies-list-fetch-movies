const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=da70b4e9';

const request = (url: string) => fetch(`${BASE_URL}${url}`)
  .then(resp => resp.json());

export const findMovie = (title: string) => request(`&t=${title}`);
