export const getMovieFromServer = async (title: string) => {
  const response = await
  fetch(`https://www.omdbapi.com/?apikey=ccfbb4e6&t=${title}`);

  return response.json();
};
