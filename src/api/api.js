const BASE_URL = `https://www.omdbapi.com/?apikey=ec8f0edf`;

export function request(title) {
  return fetch(`${BASE_URL}&t=${title}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
