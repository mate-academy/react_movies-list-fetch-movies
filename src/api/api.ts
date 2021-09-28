const API_URL = 'https://www.omdbapi.com/?apikey=374960bd';

export const getFilm = async (title: string) => {
  const res = await fetch(`${API_URL}&t=${title}`);

  return res.json();
};
