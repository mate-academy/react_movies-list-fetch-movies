const BASE_URL = 'http://www.omdbapi.com/?apikey=b6667533';

const wait = delay => new Promise(resolve => setTimeout(resolve, delay));

export const getMovie = async(title) => {
  const response = await fetch(`${BASE_URL}&t=${title}`);

  await wait(100);

  return response.json();
};
