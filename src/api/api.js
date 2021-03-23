const API_KEY = '4c3b4bea';
const MOVIES_BASIC_LINK = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export const getMovieByTitle = title => fetch(
  `${MOVIES_BASIC_LINK}&t=${title}`,
).then(response => response.json());
