const API_URL = 'https://www.omdbapi.com/?apikey=[yourkey]&t=[title]';

const request = (title: string) => {
  return fetch(`${API_URL}${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};

export const getMovie = async (title: string) => {
  const movie = await request(`t=${title}`);

  if (movie.Response === 'False') {
    throw new Error("Can't find a movie with such a title");
  }

  return movie;
};
