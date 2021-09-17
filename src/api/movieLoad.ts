const BASE_URL = 'https://www.omdbapi.com/?apikey=de16e785';

export const loadMovie = (title: string) => {
  return fetch(`${BASE_URL}&t=${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};
