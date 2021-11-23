const BASE_URL = 'https://www.omdbapi.com/?apikey=bc0a60f1&t=';

const sendRequest = async (tail: string) => {
  try {
    const response = await fetch(BASE_URL + tail);

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getMovieByTitle = async (movieTitle: string) => {
  const movie = await sendRequest(movieTitle);

  if (movie.Error) {
    throw new Error(`${movie.Error}`);
  }

  return movie;
};
