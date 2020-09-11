export const getFilm = async(title) => {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=6d421132&t=${title}`,
  );

  return response.json();
};
