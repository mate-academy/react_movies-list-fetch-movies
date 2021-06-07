const API = 'https://www.omdbapi.com/?apikey=aa1c51db&t=';

export const request = (url, options) => fetch(`${API}${url}`, options)
  .then(response => response.json());
