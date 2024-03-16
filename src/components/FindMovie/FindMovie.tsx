import React, { SetStateAction, useState } from 'react';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

const DEFAULT_PIC = 'https://via.placeholder.com/360x270.png?text=no%20preview';

interface Props {
  movies: Movie[];
  setMovies: React.Dispatch<SetStateAction<Movie[]>>;
}

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(newMovie => {
        if ('Title' in newMovie) {
          const { Poster, Title, Plot, imdbID } = newMovie;

          setMovie({
            title: Title,
            description: Plot,
            imdbId: imdbID,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imgUrl: Poster === 'N/A' ? DEFAULT_PIC : Poster,
          });
          setErrorMessage('');
        } else {
          setErrorMessage("Can't find a movie with such a title");
        }
      })
      .finally(() => setLoading(false));
  };

  const addMovie = (newMovie: Movie) => {
    const findMovie = movies.some((m: Movie) => m.title === newMovie.title);

    if (!findMovie) {
      setMovies((prevMovies: Movie[]) => [...prevMovies, newMovie]);
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
                'is-danger': errorMessage,
              })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              disabled={!query}
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie(movie)}
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
};
