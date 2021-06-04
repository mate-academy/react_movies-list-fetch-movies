const BASE_URL = 'https://www.omdbapi.com/?apikey=913d66b8&t=';

export function getMoviesData(title) {
  return fetch(`${BASE_URL}${title}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
