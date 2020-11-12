const API_KEY = '9b42833c';
const API_URL = 'https://www.omdbapi.com/';

export async function getMoviesByTitle(title) {
  const respons = await fetch(`${API_URL}?apikey=${API_KEY}&t=${title}`);

  return respons.json();
}
