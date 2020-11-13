/* eslint-disable arrow-body-style */
const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=74104b40';

export const request = (url, options) => {
  return fetch(`${BASE_URL}&t=${url}`, options).then((res) => {
    if (!res.ok) {
      throw new Error(`${res.status}`);
    }

    return res.json();
  });
};
