const api = 'https://www.omdbapi.com/?apikey=d76b35cd&t=';

export const getMovie = async (movieTitle: string) => {
  const response = await fetch(`${api}${movieTitle}`);

  return response.json();
};
