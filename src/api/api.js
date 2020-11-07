const BASE_URL = 'http://www.omdbapi.com/?apikey=892b42fa';

const request = url => fetch(`${BASE_URL}${url}`)
  .then(response => response.json());

export const getFilm = title => request(`&t=${title}`);
