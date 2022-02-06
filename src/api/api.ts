const API_URL = 'https://www.omdbapi.com/';

export const getMovie = async (title: string) => {
  const key = '17b789c0';

  try {
    const response = await fetch(`${API_URL}?apikey=${key}&t=${title}`);

    return await response.json();
  } catch (error) {
    throw new Error(`Something went wrong: ${error}`);
  }
};
