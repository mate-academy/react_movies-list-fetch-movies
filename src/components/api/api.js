const BASE_URL = 'https://www.omdbapi.com/?apikey=67b35370&t=';

export const request = async(title) => {
  try {
    const response = await fetch(`${BASE_URL}${title}`);

    if (!response.ok) {
      throw new Error('Couls not fetch data for that resurs.....');
    }

    const movie = await response.json();

    return movie.data || movie;
  } catch (error) {
    throw new Error('Server errror');
  }
};
