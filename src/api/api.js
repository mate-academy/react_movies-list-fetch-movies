export function request(title) {
  const url = 'https://www.omdbapi.com/?apikey=8d990354';

  return fetch(`${url}&t=${title}`)
    .then(response => response.json());
}
