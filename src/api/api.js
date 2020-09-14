const BASE_URL = 'http://www.omdbapi.com/?apikey=fa981f80&t=';

export const getMovie = async(title) => {
  const movie = await fetch(`${BASE_URL}${title}`);

  return movie.json();
};
