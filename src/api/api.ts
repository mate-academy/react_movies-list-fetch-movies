export const API_URL = 'https://www.omdbapi.com/?apikey=9680a20c';

export const getMovie = (title: string) => {
  return fetch(`${API_URL}&t=${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};
