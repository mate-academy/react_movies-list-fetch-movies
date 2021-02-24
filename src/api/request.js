/* eslint-disable no-throw-literal */
const baseURL = 'http://www.omdbapi.com/';
const key = 'f7a5fcde';

const request = url => fetch(`${baseURL}${url}`)
  .then((response) => {
    if (!response.ok) {
      throw `${response.status} - ${response.statusText}`;
    }

    return response.json();
  })
  .then((response) => {
    if (response.Response === 'False') {
      throw new Error('Error');
    }

    return response;
  });

export const getMovie = query => request(`?t=${query}&apikey=${key}`);
