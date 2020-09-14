const url = 'https://www.omdbapi.com/?apikey=3345228&t=';

export const getMovieFromServer = async(title) => {
  const movie = await fetch(`${url}${title}`);

  return movie.json();
};
