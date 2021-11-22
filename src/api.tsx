const API_URL = 'https://www.omdbapi.com/?apikey=bca5eec2';

export const request = async (url: string) => {
  try {
    const response = await fetch(`${API_URL}&t=${url}`);

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`The problem is here ${error}`);
  }
};

export const getMovieByTitle = async (title: string) => {
  const movie = await request(title);

  if (movie.Response === 'False') {
    throw new Error(`Error: ${movie.Error}`);
  }

  return movie;
};
