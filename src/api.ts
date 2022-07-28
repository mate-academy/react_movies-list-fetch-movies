const API_URL = 'http://www.omdbapi.com/?apikey=cb76a400';

export const getMovie = async (title: string): Promise<Movie> => {
  const responce = await fetch(`${API_URL}&t=${title}`);

  return responce.json();
};
