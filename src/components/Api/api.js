const apikey = 'de15cdda';

const BASE_URL = `https://www.omdbapi.com/`;

export function getMovie(title) {
  return fetch(`${BASE_URL}?t=${title}&apikey=${apikey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
