export const getMovie = async (title: string): Promise<Movie> => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=2b90500e&t=${title}`);

  return response.json();
};
