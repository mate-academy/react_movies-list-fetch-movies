const API_URL = 'https://www.omdbapi.com/?apikey=443fd0d5&';

export const getMovie = (title: string) => {
  return fetch(`${API_URL}t=${title}`)
    .then(response => response.json());
};
