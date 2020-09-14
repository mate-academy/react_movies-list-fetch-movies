const MOVIE_URL = 'https://www.omdbapi.com/?apikey=cc837460&t=/';

export const GetMovie = async(title) => {
  const response = await fetch(`${MOVIE_URL}${title}`);

  return response.json();
};
