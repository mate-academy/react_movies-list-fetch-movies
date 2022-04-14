const BASE_URL = 'https://www.omdbapi.com/?apikey=3505f6f5&t=';

export function request(title: string) {
  return fetch(`${BASE_URL}${title}`)
    .then(response => response.json());
}
