const URL = 'https://www.omdbapi.com/?apikey=27284918&t=';

export const getMovie = async (query: string) => {
  const response = await fetch(`${URL}${query}`);

  return response.json();
};
