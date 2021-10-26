const key = 'f019d615';
const API_URL = 'http://www.omdbapi.com';
const request = (url: string) => {
  return fetch(`${API_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};

export const getMovie = async (title: string) => {
  const movie = await request(`/?apikey=${key}&t=${title}`);

  if (movie.Response === 'False') {
    throw new Error('Movie not found');
  }

  return movie;
};
