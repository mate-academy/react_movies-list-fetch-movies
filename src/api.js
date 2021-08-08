const BASE_URL = 'https://www.omdbapi.com/?apikey=450c55f&t=';

export const request = async(url) => {
  const require = await fetch(`${BASE_URL}${url}`);
  const result = await require.json();

  return result;
};

export const getMovie = async(title) => {
  const movie = await request(title);

  return movie;
};
