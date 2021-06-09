const BASE_URL = 'https://www.omdbapi.com/?apikey=f353cda5&t=';

export const getFilm = async(searchQuery) => {
  const URL = BASE_URL + (searchQuery.toLowerCase().split(' ').join('+'));
  const response = await fetch(URL);
  const film = await response.json();

  return film;
};
