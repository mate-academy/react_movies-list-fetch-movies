const API_URL = 'https://www.omdbapi.com/?apikey=75257100';

export const getMovie = async title => fetch(`${API_URL}&t=${title}`)
  .then(response => response.json());
