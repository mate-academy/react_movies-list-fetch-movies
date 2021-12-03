const BASE_URL = 'https://www.omdbapi.com/?apikey=b294fc5f&t=';

const request = async (endPoint:string) => {
  try {
    const response = await fetch(`${BASE_URL}&t=${endPoint}`);

    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getMovieByTitle = async (title: string) => {
  const movie = await request(title);

  if (movie.Error) {
    throw new Error(`${movie.Error}`);
  }

  return movie;
};
