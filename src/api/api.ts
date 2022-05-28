const BASE_URL = 'https://www.omdbapi.com/?apikey=ccfbb4e6&t=';

export const getMovieFromServer = async (title: string) => {
  const response = await
  fetch(`${BASE_URL}${title}`);

  return response.json();
};
