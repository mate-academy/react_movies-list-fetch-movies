const BASE_URL = 'http://www.omdbapi.com/?apikey=a91b1362&t=';

export const getFilm = async (filmTitle: string): Promise<Movie> => {
  const targetUrl = BASE_URL + filmTitle;
  const response = await fetch(targetUrl);

  const data = await response.json();

  if (data.Response === 'False') {
    throw new Error('Don\'t find that film');
  }

  return data;
};
