export const getMovies = async (title: string) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=9e088334&t=${title}`);

  return response.json();
};
