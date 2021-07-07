const MOVIE_URL = 'https://www.omdbapi.com/?apikey=d905df00&t=';

export const getMovie = async(title) => {
  const response = await fetch(MOVIE_URL + title);

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return response.json();
};
