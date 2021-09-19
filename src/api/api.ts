const API_URL = 'https://www.omdbapi.com/?apikey=b3d6913d&';

export const getMovie = async (title: string) => {
  const response = await fetch(`${API_URL}t=[${title}]`);

  if (!response.ok) {
    return Promise.reject(new Error('Failed to load data'));
  }

  return response.json();
};
