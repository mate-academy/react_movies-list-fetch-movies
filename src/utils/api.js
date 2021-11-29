export const getMovieByTitle = async (title) => {
  const APIkey = 'a2b58a28';
  const moviesUrl = 'https://www.omdbapi.com/?apikey=';
  const response = await fetch(`${moviesUrl}${APIkey}&t=${title}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Error with request');
  }

  return data;
};
