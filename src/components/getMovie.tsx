import { MoviesCard } from './interfaces';

export const getMovie = async (title: string) => {
  const APIkey = '12dad60c'
  const movieUrl = `https://www.omdbapi.com/?apikey=${APIkey}&t=${title}`;
  const getDatas = await fetch(movieUrl);
  const preparedDatas = await getDatas.json();

  if (preparedDatas.hasOwnProperty('Error')) {
    return false;
  }

  const newMovieInfo: MoviesCard = {
    description: preparedDatas.Plot,
    title: preparedDatas.Title,
    imdbId: preparedDatas.imdbID,
    imdbUrl: '',
    imgUrl: preparedDatas.Poster,
  };

  newMovieInfo.imdbUrl = `https://www.imdb.com/title/${newMovieInfo.imdbId}/?ref_=nv_sr_srsg_0`;

  return newMovieInfo;
};
