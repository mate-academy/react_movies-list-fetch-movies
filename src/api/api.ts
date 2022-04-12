const API_URL = 'https://www.omdbapi.com/';
const API_KEY = '4afd47f3';

export const request = (title: string) => fetch(`${API_URL}?apikey=${API_KEY}&t=${title}`)
  .then((res) => res.json());
