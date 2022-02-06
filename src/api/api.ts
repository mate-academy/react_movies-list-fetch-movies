const API_URL = 'https://www.omdbapi.com/?apikey=46a92da5&t=';

export const getMovie = async (title: string): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}${title}`);

    return await response.json();
  } catch (error) {
    throw new Error('error');
  }
};
