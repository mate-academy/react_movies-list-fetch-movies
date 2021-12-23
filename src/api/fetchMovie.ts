const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=5b9f7c2e&t=';

export const movieFetch = async<T>(searchParam: string): Promise<T> => {
  const response = await fetch(BASE_URL + searchParam);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
};
