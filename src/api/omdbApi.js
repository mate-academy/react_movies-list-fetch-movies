const URL = 'http://www.omdbapi.com/?apikey=f7dddb7c&t=';

export const fetchMovie = async(title) => {
  const data = await fetch(`${URL}${title}`);

  return data.json();
};
