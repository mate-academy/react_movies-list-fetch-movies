import classNames from 'classnames';
import { FC, useCallback, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  addMovieToList: (movie: Movie) => void;
}

export const FindMovie: FC<Props> = (props) => {
  const { addMovieToList } = props;
  const [searchTitle, setSearchTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const onFindMovie = useCallback((event) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(searchTitle)
      .then(response => {
        if ('Error' in response) {
          setIsError(true);
        } else {
          setMovie(
            {
              title: response.Title,
              description: response.Plot,
              imgUrl: response.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : response.Poster,
              imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
              imdbId: response.imdbID,
            },
          );
        }
      })
      .finally(() => setIsLoading(false));
  }, [searchTitle]);

  const onAddToList = useCallback(() => {
    if (movie) {
      addMovieToList(movie);
    }

    setSearchTitle('');
    setMovie(null);
  }, [addMovieToList, movie]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => onFindMovie(event)}
      >
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
              className="input is-dander"
              value={searchTitle}
              onChange={(event) => {
                setSearchTitle(event.target.value);
                setIsError(false);
              }}
            />
          </div>

          {isError && (
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
              className={classNames(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!searchTitle}
            >
              {movie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddToList}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {movie && <MovieCard movie={movie} />}
        </div>
      )}

    </>
  );
};
