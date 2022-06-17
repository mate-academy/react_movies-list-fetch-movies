const API_URL = 'https://www.omdbapi.com/?apikey';
const MY_KEY = 'bd1244c7';

export const request = (title: string) => {
  return fetch(`${API_URL}=${MY_KEY}&t=${title}`)
    .then(response => response.json());
};
