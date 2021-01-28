export const getMovie = title => fetch(
  `https://www.omdbapi.com/?apikey=e1b34ef6&t=${title}`,
)
  .then(response => response.json());
