const BASE_URL = 'http://www.omdbapi.com/?apikey=43371f3e';

export const loadMovie = async (title: string) => {
  const response = await fetch(`${BASE_URL}&t=${title}`);

  return response.json();
};
