const API_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=5cedccaf';

export const getMovie = async (title: string): Promise<Movie> => {
  const movie = await fetch(`${API_URL}&t=${title}`);

  return movie.json();
};
