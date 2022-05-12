const BASE_URL = 'https://www.omdbapi.com/?apikey=';
const personalKey = '6a07e73f';

const request = async (url: string) => {
  const response = await fetch(`${BASE_URL}${url}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  const result = await response.json();

  // I was forced to add the condition below
  // because there is no any mistake if the title request is wrong
  // we just receive response object with message 'Error'
  if (!result.Title) {
    throw new Error('Wrong title');
  }

  return result;
};

export const getMovie = (movieTitle: string) => {
  return request(`${personalKey}&t=${movieTitle}`);
};
