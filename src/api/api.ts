const API_URL = 'http://www.omdbapi.com/?apikey=65e33bea&t=';

export const getMovie = (endpoint: string) => {
  return fetch(`${API_URL}${endpoint}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    })
    .then(response => {
      if (response.Error) {
        return null;
      }

      return response;
    });
};
