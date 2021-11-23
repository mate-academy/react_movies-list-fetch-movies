export const BASE_URL = 'https://www.omdbapi.com/?apikey=9ca89b69';

export const request = (url: string) => {
  return fetch(`${BASE_URL}&t=${url}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('no movie with such name found');
      }

      return res.json();
    });
};

export const findMovieByTitle = async (title: string) => {
  const movie = await request(title);

  if (movie.Response === 'False') {
    throw new Error('Error: djkhfdj');
  }

  return movie;
};
