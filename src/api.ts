/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
const BASE_URL = 'https://www.omdbapi.com/?apikey=eb4a7b27';

const getData = (url: string) => (
  fetch(`${BASE_URL}${url}`)
    .then(resp => (resp.ok
      ? resp.json()
      : Promise.reject(`${resp.status}: ${resp.statusText}`)))
);

export const getMovieByTitle = (title: string) => (
  getData(`&t=${title}`)
);
