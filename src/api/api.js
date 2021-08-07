const BASE_URL = 'http://www.omdbapi.com';

export function getMovie(title) {
  return fetch(`${BASE_URL}/?apikey=8ffa39b3&t=${title}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
