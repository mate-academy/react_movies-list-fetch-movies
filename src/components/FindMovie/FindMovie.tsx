import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../type/Movie';
import { Loader } from '../Loader';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  movies: Movie[],
  onAddMovie: (newMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAddMovie, movies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [clickOnAdd, setClicOnAdd] = useState(false);
  const [dublicates, setDublicates] = useState(false);

  const findMovie = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const foundMovie = await getMovie(title.trim());

      setMovie(foundMovie);
      setLoading(false);
      setTitle('');
    } catch (error) {
      setLoading(false);
    }
  };

  const foundedMovie = String(movie?.Response) === 'True';
  const notFoundedMovie = String(movie?.Response) === 'False';

  const validateTitle = (prevClass: string) => classNames(
    prevClass,
    { 'is-danger': notFoundedMovie },
    { 'is-success': foundedMovie },
  );

  return (
    <>
      <form className="find-movie" onSubmit={findMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={!movie ? 'input' : validateTitle('input')}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          {movie && (
            <p className={!movie ? 'help' : validateTitle('help')}>
              {foundedMovie ? 'Can ' : 'Can`t '}
              find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          {foundedMovie && (
            <div className="control">
              <button
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (movie) {
                    const hasDublicates = movies
                      .map(mov => mov.imdbID)
                      .includes(movie.imdbID);

                    if (!hasDublicates) {
                      onAddMovie(movie);
                    } else {
                      setClicOnAdd(true);
                      setDublicates(true);
                    }
                  }

                  setTimeout(() => {
                    setClicOnAdd(false);
                  }, 2000);
                }}
              >
                Add to the list
              </button>
              {dublicates && clickOnAdd && (
                <p className="help is-danger">
                  Sorry, this film is already.
                </p>
              )}
            </div>
          )}
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {loading && <Loader />}
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
