export const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=b61f4eb3&t=';

export const loadMovie = async (title: string) => {
  const response = await fetch(BASE_URL + title);

  return response.json();
};
