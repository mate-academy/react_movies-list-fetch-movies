const APIKey = 'c82a2951';
const APILink = 'https://www.omdbapi.com';

export const findFilmByTitle = async (inpTitle: string) => {
  const requestLink = `${APILink}/?apikey=${APIKey}&t=${inpTitle}`;
  const response = await fetch(requestLink);

  return response.json();
};
