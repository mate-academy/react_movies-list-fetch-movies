const BASE_URL = 'https://www.omdbapi.com/?apikey=c8121c98&t=';

const request = (url: string) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};

export const getMovie = async (title: string) => {
  const movie = await request(title);

  if (movie.Response === 'False') {
    throw new Error('Movie not found');
  }

  return movie;
};
