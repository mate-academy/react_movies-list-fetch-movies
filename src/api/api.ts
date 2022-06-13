const BASE_URL = 'https://www.omdbapi.com/?apikey=7d867aae&t=';

export const searchFilm = async (title:string) => {
  const response = await fetch(`${BASE_URL}${title}`);

  return response.json();
};
