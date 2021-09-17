const BASE_URL = 'https://www.omdbapi.com/?apikey=90c672b7&t=';

export const getMovies = async (title: string): Promise<MovieFromServer> => {
  const response = await fetch(`${BASE_URL}${title}`);

  if (!response.ok) {
    return Promise.reject(new TypeError('Error'));
  }

  return response.json();
};
