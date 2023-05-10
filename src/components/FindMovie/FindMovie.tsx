import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

const noPreview = 'https://via.placeholder.com/360x270.png?text=no%20preview';

interface Props {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
}

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFoundMovie, setNotFoundMovie] = useState(false);

  const findMovie = async () => {
    try {
      setIsLoading(true);

      const receivedMovieData = await getMovie(query);

      if ('Error' in receivedMovieData) {
        setNotFoundMovie(true);
        throw new Error(receivedMovieData.Error);
      }

      const {
        Title, Plot, Poster, imdbID,
      } = receivedMovieData;

      const toMovie: Movie = {
        title: Title,
        description: Plot,
        imgUrl: Poster,
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      };

      if (Poster === 'N/A') {
        toMovie.imgUrl = noPreview;
      }

      setMovie(toMovie);
    } catch (error) {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setMovie(null);
  };

  const handleAddMovie = () => {
    handleReset();

    if (movie) {
      if (!movies.some(({ imdbId }) => imdbId === movie.imdbId)) {
        setMovies([...movies, movie]);
      }
    }
  };

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setNotFoundMovie(false);
  };

  const handleSubmitForm = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    findMovie();
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmitForm}
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
              value={query}
              onChange={handleChangeQuery}
            />
          </div>

          {notFoundMovie && (
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
