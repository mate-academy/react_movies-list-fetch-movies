/* eslint-disable */
export const getMovie = async(query) => {
  const response = await fetch(`http://www.omdbapi.com/?apikey=85d016e4&t=${query}`);
  const result = await response.json();

  return result;
};
