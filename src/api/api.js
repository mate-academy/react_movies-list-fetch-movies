const BASE_URL = 'https://www.omdbapi.com/?apikey=6884881&t=';

export function request(filmTitle) {
  return fetch(`${BASE_URL}${filmTitle}`)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }

      return response.json();
    });
}
