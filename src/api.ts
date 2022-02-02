const apiKey = '3377c5fe';

export const requestApi = async (query: string): Promise<Movie> => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${query}`);

  return response.json();
};
