export const getMovie = async (inputTitle: string) => {
  const responce = await fetch(`https://www.omdbapi.com/?apikey=e3df8ec5&t=${inputTitle}`);

  return responce.json();
};
