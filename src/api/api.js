const BASE_URL = 'https://www.omdbapi.com/?apikey=fef53722&t=';

export function getMovie(title) {
  return fetch(BASE_URL + title)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
