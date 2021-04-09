const BASE_URL = 'https://www.omdbapi.com/?apikey=317c681f&t=';

const request = (url, options) => fetch(`${BASE_URL}${url}`, options)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return response.json();
  });

export const getMovie = film => request(film);
