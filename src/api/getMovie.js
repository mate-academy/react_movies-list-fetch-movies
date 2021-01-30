/* eslint-disable */
// export const getMovie = async(query) => {
//   const response = await fetch(`http://www.omdbapi.com/?apikey=85d016e4&t=${query}`);
//   const result = await response.json();
//
//   return result;
// };

const URL = `https://www.omdbapi.com/?apikey=85d016e4&t=`;

export const getMovie = async(query) => {
  const response = await fetch(`${URL}${query}`);

  return response.json();
};
