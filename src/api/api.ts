const API_URL = 'https://www.omdbapi.com/?apikey=6ed33a11';

export const request = async (title: string): Promise<Movie> => {
  const responce = await fetch(`${API_URL}&t=${title}`);

  if (!responce.ok) {
    return Promise.reject(new Error('Failed to load data'));
  }

  return responce.json();
};
