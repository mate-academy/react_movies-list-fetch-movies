const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=d963d90b&';

export const getMovieByTitle = async (filter: string) => {
  const response = await fetch(`${BASE_URL}t=[${filter}]`);

  return response.json();
};
