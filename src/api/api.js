export const getMovie = title => fetch(
  `https://www.omdbapi.com/?apikey=e5e83988&t=${title}`,
)
  .then(response => response.json());
