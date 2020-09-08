const URL = 'http://www.omdbapi.com/?apikey=';
const KEY = 'edc9ca3c';

const request = async(title) => {
  try {
    const response = await fetch(`${URL}${KEY}${title}`);
    const data = response.json();

    return data;
  } catch (error) {
    throw new Error('Whoops!');
  }
};

export const getMovie = async(title) => {
  const data = await request(`&t=${title}`);

  return data;
};
