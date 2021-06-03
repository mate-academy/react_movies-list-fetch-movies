const BASE_URL = 'https://www.omdbapi.com/?apikey=4636557e&t=';

export function getData(title) {
  return fetch(`${BASE_URL}${title}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
