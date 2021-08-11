const URL = `https://www.omdbapi.com/`;
const apikey = 'de15cdda';

export const getMovies = async(title) => {
  const response = await fetch(`${URL}?t=${title}&apikey=${apikey}`);
  const movies = await response.json();

  return movies;
};
