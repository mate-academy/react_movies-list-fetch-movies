const BASE_URL = 'https://www.omdbapi.com';
const key = 'f03d3d62';

export const request = movieTitle => fetch(
  `${BASE_URL}/?apikey=${key}&t=${movieTitle}`,
).then(response => response.json());
