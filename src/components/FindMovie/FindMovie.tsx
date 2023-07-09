import {
  FC, useState, FormEvent, ChangeEvent,
} from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (newMovie: Movie) => void;
};

export const FindMovie: FC<Props> = ({ onAddMovie }) => {
  const [moviePreview, setMoviePreview] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [hasSearchError, setHasSearchError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const getMoviePoster = (imgUrl: string) => {
    // eslint-disable-next-line max-len
    const validImgUrl = /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@,.\w_]*)#?(?:[,.!/\\\w]*))?)$/;

    // eslint-disable-next-line max-len
    const defaultImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

    if (validImgUrl.test(imgUrl)) {
      return imgUrl;
    }

    return defaultImg;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setHasSearchError(false);
    setIsSearching(true);

    try {
      const data = await getMovie(query);

      if (Object.hasOwn(data, 'Error')) {
        const errorResponse = data as ResponseError;

        throw new Error(errorResponse.Error);
      }

      const movieData = data as MovieData;

      const movieUrl = `https://www.imdb.com/title/${movieData.imdbID}`;
      const posterUrl = getMoviePoster(movieData.Poster);

      const searchedMovie: Movie = {
        title: movieData.Title,
        description: movieData.Plot,
        imdbId: movieData.imdbID,
        imgUrl: posterUrl,
        imdbUrl: movieUrl,
      };

      setMoviePreview(searchedMovie);
    } catch (error) {
      setHasSearchError(true);
    } finally {
      setIsSearching(false);
    }
  };

  const onAddNewMovie = () => {
    if (moviePreview) {
      onAddMovie(moviePreview);

      setHasSearchError(false);
      setQuery('');
    }

    setMoviePreview(null);
  };

  const handleChangeQuery = (event: ChangeEvent<HTMLInputElement>) => {
    setHasSearchError(false);
    setQuery(event.target.value);
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': hasSearchError,
              })}
              value={query}
              onChange={handleChangeQuery}
            />
          </div>

          {hasSearchError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isSearching,
              })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {moviePreview && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddNewMovie}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>

      {moviePreview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={moviePreview} />
        </div>
      )}
    </>
  );
};
