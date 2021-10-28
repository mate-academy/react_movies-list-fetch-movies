const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=6056e7c&t=';

const request = (title: string) => {
  return fetch(`${BASE_URL}${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};

export const getMovie = async (title: string) => {
  const movie = await request(`${title}`);

  if (movie.Response === 'False') {
    throw new Error('Movie not found');
  }

  return movie;
};
