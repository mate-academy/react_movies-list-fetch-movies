const OMDB_KEY = 'da979bab';

export const getMovie = async (title:string) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_KEY}&t=${title}`);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
};
