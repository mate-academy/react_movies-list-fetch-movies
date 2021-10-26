// eslint-disable-next-line
const API_URL = 'https://www.omdbapi.com/?apikey=85e2e7b5&t=';

export const promise = (endPoint: string) => {
  const fullURL = `${API_URL}${endPoint}`;

  return fetch(fullURL)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error('Can\'t find source'));
      }

      return response.json();
    });
};
