const BASE_URL = 'https://www.omdbapi.com/';
const key = '85d016e4';

export const getMovie = async(enteredName) => {
  const request = await fetch(`${BASE_URL}?apikey=${key}&t=${enteredName}`);

  return request.json();
};
