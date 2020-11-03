const BASE_URL = 'http://www.omdbapi.com/?apikey=87aae092&t=';

function request(url) {
  return fetch(`${BASE_URL}${url}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}

export function getMovie(title) {
  return request(title);
}
