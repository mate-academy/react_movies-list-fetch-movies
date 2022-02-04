const API_URL = 'http://www.omdbapi.com/?apikey=de6fe9cf';

export const getMovie = async (title: string) => {
  try {
    const response = await fetch(`${API_URL}&t=${title}`);

    return await response.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};
