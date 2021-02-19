
const BASE_URL = 'http://www.omdbapi.com/?apikey=8189ef4d&t=';

export const requestMovie = (title) => {
  const movie = fetch(BASE_URL + title);

  return movie;
};
