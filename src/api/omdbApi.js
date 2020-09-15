const URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=f7dddb7c&t=';

export const fetchMovie = async(title) => {
  const data = await fetch(`${URL}${title}`);

  return data.json();
};
