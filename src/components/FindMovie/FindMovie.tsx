import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovies: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovies }) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const changeMovie = async (inputValue: string) => {
    setIsLoading(true);

    const newMovie = await getMovie(inputValue)
      .finally(() => setIsLoading(false));

    if ('Error' in newMovie) {
      setIsError(true);
    } else {
      setIsError(false);
      const {
        Title,
        Plot,
        Poster,
        imdbID,
      } = newMovie;

      const imdbUrl = `https://www.imdb.com/title/${imdbID}`;

      setMovie({
        title: Title,
        description: Plot,
        imgUrl: Poster,
        imdbUrl,
        imdbId: imdbID,
      });
    }
  };

  useEffect(() => {
    setIsError(false);
  }, [searchTitle]);

  const sendQuery = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const titleEdited = searchTitle.trim().toLowerCase();

    changeMovie(titleEdited);
  };

  const clearSideBar = () => {
    setIsError(false);
    setSearchTitle('');
    setMovie(undefined);
  };

  const addToList = () => {
    if (movie) {
      addMovies(movie);
    }

    clearSideBar();
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
              name="input"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={searchTitle}
              onChange={(event) => {
                setSearchTitle(event.target.value);
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
              disabled={!searchTitle.trim().length || false}
              className={
                classNames(
                  'button is-light',
                  { 'is-loading': isLoading },
                )
              }
              onClick={sendQuery}
            >
              Find a movie
            </button>
          </div>

          { movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addToList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      { movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
