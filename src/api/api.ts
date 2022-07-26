const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=6ed33a11';

export const request = async (title: string): Promise<Movie> => {
  const responce = await fetch(`${API_URL}&t=${title}`);

  if (!responce.ok) {
    return Promise.reject(new Error('Failed to load data'));
  }

  return responce.json();
};
