export const getMovie = title => (
  fetch(`https://www.omdbapi.com/?apikey=b8de536f&t=${title}`)
    .then(response => response.json())
    .catch(error => error)
);
