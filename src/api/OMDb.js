const URL_API = 'https://www.omdbapi.com/';

export function getInfo(title) {
  return fetch(`${URL_API}?apikey=d905f6c1&t=${title}`)
    .then(response => response.json());
}
