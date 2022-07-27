import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  handleAddMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ handleAddMovie }) => {
  const [userQuery, setUserQuery] = useState('');
  const [isError, setIsError] = useState(false);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createMovie = (movie: MovieData) => {
    const {
      Title,
      Plot,
      Poster,
      imdbID,
    } = movie;

    setFoundMovie({
      title: Title,
      description: Plot,
      imdbId: imdbID,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imgUrl: Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : Poster,
    });
  };

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setIsLoading(true);

    await getMovie(userQuery)
      .then(movies => {
        if ('Error' in movies) {
          setIsError(true);
        } else {
          createMovie(movies);
          setIsError(false);
        }
      });

    setIsLoading(false);
  };

  const handleReset = () => {
    if (foundMovie) {
      handleAddMovie(foundMovie);
      setUserQuery('');
      setFoundMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie">
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
              value={userQuery}
              onChange={(event) => setUserQuery(event.target.value)}
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
              className={isLoading
                ? 'button is-light is-loading'
                : 'button is-light'}
              disabled={userQuery.length <= 0}
              onClick={(event) => handleSubmit(event)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {foundMovie
              && (
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={handleReset}
                >
                  Add to the list
                </button>
              )}
          </div>
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
