const baseURL = 'https://www.omdbapi.com/?apikey=';
const apiKey = 'fb5e9d6';

export const request = title => fetch(`${baseURL}${apiKey}&t=${title}`)
  .then(response => response.json())
  .catch(() => new Error('Failed key'));
