const request = (param: string) => {
  return fetch(param)
    .then(response => response.json());
};

export const findMovie = async (title: string) => {
  const movie = await request(`https://www.omdbapi.com/?apikey=83c2eadd&t=${title}`);

  if (movie.Response === 'False') {
    throw new Error('Movie not found');
  }
  return movie;
};
