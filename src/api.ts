const OMDB_API = 'https://www.omdbapi.com/?i=tt3896198&apikey=b2b9c7f0';

export const getMovie = async (searchString: string) => {
  return fetch(`${OMDB_API}&t=${searchString}`)
    .then(response => response.json());
};
