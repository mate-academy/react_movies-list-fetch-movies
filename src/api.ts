const BASE_URL = 'https://www.omdbapi.com/?apikey=bca5eec2';

export const request = async (movieUrl: string) => {
  try {
    const response = await fetch(`${BASE_URL}&t=${movieUrl}`);

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`ERROR: ${error}`);
  }
};

export const getMovieByTitle = async (title: string) => {
  const movie = await request(title);

  if (movie.Response === 'False') {
    throw new Error(`Error: ${movie.Error}`);
  }

  return movie;
};
