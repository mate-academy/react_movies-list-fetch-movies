const key = '5dff2d5f';
const BASE_URL = `https://www.omdbapi.com/?apikey=${key}`;

export const request = (title, options) => (
  fetch(`${BASE_URL}&t=${title}`, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    })
);
