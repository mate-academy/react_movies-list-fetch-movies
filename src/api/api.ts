import { ErrorMessages } from './Errors';

const BASE_URL = 'https://www.omdbapi.com/?apikey=b8686686&t=';

const convertToMovieType = (body: ResponceBody): Movie => ({
  Poster: body.Poster,
  Title: body.Title,
  Plot: body.Plot,
  imdbID: body.imdbID,
});

export const getMovie = async (title: string): Promise<Movie> => {
  const body: ResponceBody = await fetch(BASE_URL + title)
    .then(res => res.json());

  if (body.Response === 'True') {
    return convertToMovieType(body);
  }

  throw new Error(ErrorMessages.NOT_FOUND);
};
