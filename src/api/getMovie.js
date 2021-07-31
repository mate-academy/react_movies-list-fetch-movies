// eslint-disable-next-line
const apikey = 'fec6674f';
const API_URL = `https://www.omdbapi.com`;

export function getMovie(title) {
  return fetch(`${API_URL}?apikey=${apikey}&t=${title}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
