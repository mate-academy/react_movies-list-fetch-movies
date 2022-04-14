const API_KEY = 'f18ec38e';

export const getMovieFromServer = async (title: string) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
};
