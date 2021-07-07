const baseURL = 'https://www.omdbapi.com/?apikey=7c271956&t=';

export const findMovie = title => fetch(`${baseURL}${title}`)
  .then(response => response.json());
