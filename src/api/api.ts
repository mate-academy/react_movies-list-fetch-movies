const BASE_URL = 'http://www.omdbapi.com/';
const API_KEY = '75c6567f';

function wait(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

const request = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  const movie = await response.json();

  if (movie.Response === 'False') {
    return null;
  }

  return movie;
};

export const getMovie = async (title: string) => {
  await wait(1000);

  return request(`?apikey=${API_KEY}&t=${title}`);
};
