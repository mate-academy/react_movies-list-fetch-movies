const BASE_URL = 'https://www.omdbapi.com';

export const getFilm = async(title) => {
  const film = await fetch(`${BASE_URL}/?apikey=21a609de&t=${title}`);

  return film.json();
};
