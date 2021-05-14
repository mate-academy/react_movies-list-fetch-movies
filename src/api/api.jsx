const url = 'https://www.omdbapi.com/?apikey=8f2a920a&t=';

export const getMovieFromServer = async(title) => {
  const movie = await fetch(`${url}${title}`);

  return movie.json();
};
