const API_KEY = 'cef30696';

export const getMoviesFromServer = async (title: string) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.text}`);
  }

  return response.json();
};
