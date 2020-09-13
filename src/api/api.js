const ApiOMDb = 'http://www.omdbapi.com/?apikey=fc75dfe8&t=';

export const getMovie = async(title) => {
  const response = await fetch(`${ApiOMDb}${title}`);

  return response.json();
};
