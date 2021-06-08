const key = '9d0d08ca';
const OMDb_API = 'https://www.omdbapi.com'; // eslint-disable-line

export const findMovie = async(title) => {
  const response = await fetch(`${OMDb_API}/?apikey=${key}&t=${title}`); // eslint-disable-line

  return response.json();
};
