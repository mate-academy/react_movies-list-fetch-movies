const myKey = 'ce057ebb';

export const getMovie = async (title: string) => {
  const responce = await fetch(`https://www.omdbapi.com/?apikey=${myKey}&t=${title}`);

  return responce.json();
};
