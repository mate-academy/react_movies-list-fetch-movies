const key = 'apikey=e533ffbf';

export const getMovie = async(query) => {
  const response = await fetch(`http://www.omdbapi.com/?${key}&t=${query}`);
  const result = await response.json();

  return result;
};
