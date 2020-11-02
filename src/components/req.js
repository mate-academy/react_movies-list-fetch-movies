const BASE_URL = 'http://www.omdbapi.com/?apikey=317f0705';
const request = title => fetch(`${BASE_URL}&t=${title}`)
  .then(response => response.json());

export const getFilm = id => request(`${id}`);
