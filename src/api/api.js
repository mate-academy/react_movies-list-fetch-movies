const URL = 'http://www.omdbapi.com/?apikey=e6b7e90f';

export const getMovieInfo = async(movieTitle) => {
  const movieInfo = await fetch(`${URL}&t=${movieTitle}`);

  return movieInfo.json();
};
