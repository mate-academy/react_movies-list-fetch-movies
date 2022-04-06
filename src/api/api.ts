const API_KEY = 'a851ad66';
const BASE_URL = 'https://www.omdbapi.com';

export const request = (title: string) => fetch(`${BASE_URL}/?apikey=${API_KEY}&t=${title}`)
  .then(response => response.json());
