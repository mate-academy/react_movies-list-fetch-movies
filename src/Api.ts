const moviesApi = 'https://www.omdbapi.com/';

export const getMovieFS = async (title: string, key = 'fb962328') => {
  const responce = await fetch(`${moviesApi}?apikey=${key}&t=${title}`);

  return responce.json();
};
