const BASE_URL = 'http://www.omdbapi.com/?apikey=f8dda38a';

// const apiKey = '?i=tt3896198&apikey=f8dda38a';

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
  const movie = await request(`t=${title}`);

  if (movie.Response === 'False') {
    throw new Error("Can't find a movie with such a title");
  }

  return movie;
};
