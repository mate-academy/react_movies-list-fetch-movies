import {
  ChangeEvent, FC, FormEvent, useState,
} from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';
import classNames from 'classnames';

interface Props {
  onAdd: (movie: Movie) => void,
}

export const FindMovie: FC<Props> = ({ onAdd }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieTitleQuery, setMovieTitleQuery] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoadingMovie, setIsLoadingMovie] = useState(false);

  const clearForm = () => {
    setMovie(null);
    setMovieTitleQuery('');
    setIsError(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsLoadingMovie(true);

    getMovie(movieTitleQuery)
      .then(res => {
        if ('Error' in res) {
          setIsError(true);
        } else {
          const newMovie = {
            title: res.Title,
            description: res.Plot,
            imgUrl: res.Poster,
            imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
            imdbId: res.imdbID,
          };

          setMovie(newMovie);
        }
      })
      .finally(() => setIsLoadingMovie(false));
  };

  const handleSearchTitleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setMovieTitleQuery(event.target.value);
    setIsLoadingMovie(false);
    setIsError(false);
  };

  const handleAddButton = () => {
    if (movie !== null) {
      onAdd(movie);
      clearForm();
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              value={movieTitleQuery}
              onChange={handleSearchTitleInput}
            />
          </div>

          {isError
           && (
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
                { 'is-loading': isLoadingMovie },
              )}
              disabled={movieTitleQuery === ''}
            >
              Find a movie
            </button>
          </div>

          {movieTitleQuery && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddButton}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
