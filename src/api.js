const URL = 'https://www.omdbapi.com/?apikey=f20ff057&t=';

export const getMovies = async(title) => {
  const response = await fetch(`${URL}${title}`);
  const movies = await response.json();

  return movies;
};
