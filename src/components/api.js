export const getFilm = async(title) => {
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=6d421132&t=${title}`,
  );

  return response.json();
};
