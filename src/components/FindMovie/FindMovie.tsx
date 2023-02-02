import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (setMovieFunc: (movies: Movie[]) => Movie[]) => void
};

export const FindMovie: React.FC<Props> = React.memo(({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTitleWrong, setIsTitleWrong] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      setIsTitleWrong(false);
    }, [],
  );

  const onSearch = useCallback((event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (searchQuery !== '') {
      getMovie(searchQuery)
        .then(result => {
          const posterPlaceholder
          = 'https://via.placeholder.com/360x270.png?text=no%20preview';

          if ('Response' in result && result.Response === 'False') {
            setIsTitleWrong(true);
          } else {
            const {
              Poster, Title, Plot, imdbID,
            } = result as MovieData;

            setMovie({
              title: Title,
              description: Plot,
              imgUrl: (Poster !== 'N/A')
                ? Poster
                : posterPlaceholder,
              imdbUrl: `https://www.imdb.com/title/${imdbID}`,
              imdbId: imdbID,
            });
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [searchQuery]);

  const onAdd = () => {
    addMovie((state: Movie[]) => {
      const isInMovies = state.some(item => (
        item.imdbId === movie?.imdbId));

      if (!isInMovies && movie) {
        return (
          [...state,
            movie]
        );
      }

      return state;
    });

    setMovie(null);
    setSearchQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onSearch}
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
              value={searchQuery}
              onChange={handleQueryChange}
            />
          </div>

          {isTitleWrong && (
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
                'is-loading': isLoading,
              })}
              disabled={searchQuery === ''}
            >
              {!movie
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAdd}
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
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
});
