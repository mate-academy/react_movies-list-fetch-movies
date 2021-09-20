const BASE_URL = 'https://www.omdbapi.com/?apikey=5de94e75';

export const getData = (title: string) => {
  return fetch(`${BASE_URL}&t=${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};
