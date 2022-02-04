import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [isMovieValid, setIsMovieValid] = useState(true);
  const [searchingMovieTitle, setSearchingMovieTitle] = useState('');
  const [findedMovie, setFindedMovie] = useState<Movie | null>(null);

  const addMovieToList = () => {
    if (findedMovie) {
      addMovie(findedMovie);
      setSearchingMovieTitle('');
      setFindedMovie(null);
      setIsMovieValid(true);
    }
  };

  const searchMovie = async (title: string) => {
    if (searchingMovieTitle) {
      const movieFromServer = await getMovie(title.trim());

      if (movieFromServer.Response === 'True') {
        setIsMovieValid(true);
        setFindedMovie(movieFromServer);
      } else {
        setIsMovieValid(false);
      }
    } else {
      setIsMovieValid(false);
    }
  };

  const handleMovieTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMovieValid(true);
    setSearchingMovieTitle(event.target.value);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                type="text"
                id="movie-title"
                value={searchingMovieTitle}
                placeholder="Enter a title to search"
                className={classNames({
                  input: true,
                  'is-danger': !isMovieValid,
                })}
                onChange={handleMovieTitle}
              />
            </div>
          </label>

          {!isMovieValid && (
            <p className="help is-danger">Can&apos;t find a movie with such a title</p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => searchMovie(searchingMovieTitle)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {findedMovie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={findedMovie} />
        </div>
      )}
    </>
  );
};
