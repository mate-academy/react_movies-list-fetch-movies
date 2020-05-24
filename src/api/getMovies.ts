const API_KEY_OMDB = process.env.REACT_APP_API_KEY_OMDB;

export const getMovies = async (title: string) => {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY_OMDB}&t=${title}`,
  );

  return response;
};
