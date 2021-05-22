const BASE_URL = 'https://www.omdbapi.com/?apikey=1ad78f59&t=';

const request = url => fetch(`${BASE_URL}${url}`)
  .then(res => res.json());

export const findMovie = title => request(title);
