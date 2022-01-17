export const getMovie = async (input:string) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=3d082dc4&t=${input}`);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
};
