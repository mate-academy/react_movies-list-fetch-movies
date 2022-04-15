export const fetchMovie = (searchMovie) => {
  return fetch(`http://www.omdbapi.com/?apikey=2636363f&t=${searchMovie}`)
    .then(response => response.json())
    .then(data => data);
};
