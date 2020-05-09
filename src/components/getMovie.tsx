import { MoviesCard } from './interfaces';

export const getMovie = async (title: string) => {
  const movieUrl = `https://www.omdbapi.com/?apikey=12dad60c&t=${title}`;
  const getDatas = await fetch(movieUrl);
  const preparedDatas = await getDatas.json();

  if (preparedDatas.hasOwnProperty('Error')) {
    return false;
  }

  const newMovieInfo: MoviesCard = {
    description: '',
    title: '',
    imdbId: '',
    imdbUrl: '',
    imgUrl: '',
  };

  for (const key in preparedDatas) {
    switch (key) {
      case 'Title':
        newMovieInfo.title = preparedDatas[key];
        break;

      case 'Plot':
        newMovieInfo.description = preparedDatas[key];
        break;

      case 'Poster':
        newMovieInfo.imgUrl = preparedDatas[key];
        break;

      case 'imdbID':
        newMovieInfo.imdbId = preparedDatas[key];
        break;

      default:
        break;
    }
  }

  const imdbUrl = `https://www.imdb.com/title/${newMovieInfo.imdbId}/?ref_=nv_sr_srsg_0`;

  newMovieInfo.imdbUrl = imdbUrl;

  return newMovieInfo;
};
