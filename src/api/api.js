
const API_URL = 'http://www.omdbapi.com/';

const KEY = 'a613725b';

export const getMovie = async(title) => {
  const response = await fetch(`${API_URL}?apikey=${KEY}&t=${title}`);

  return response.json();
};
