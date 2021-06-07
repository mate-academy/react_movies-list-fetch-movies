const apikey = '7daa86e1';

const MOVIES_URL = `https://www.omdbapi.com/`;

export function getMovie(title) {
  return fetch(`${MOVIES_URL}?t=${title}&apikey=${apikey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
