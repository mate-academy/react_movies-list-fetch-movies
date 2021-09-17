const url = 'https://www.omdbapi.com/?apikey=9f031ba6&t=';

export const movieLoader = async (title: string) => {
  const movie = await fetch(`${url}${title}`);

  return movie.json();
};
