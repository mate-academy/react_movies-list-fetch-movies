const getData = async (url: string) => {
  const response = await fetch(url);
  const json = await response.json();

  return json;
};

export const getMovie = async (value: string) => {
  const API_KEY = '45abeff6';
  const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&t=${value}`;
  const movie = await getData(API_URL);

  return movie;
};
