import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { loadMovie } from '../../api/movieLoad';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;
  const [loading, setLoading] = useState(false);
  const [movieToFind, setMovieToFind] = useState('');
  const [movieFromServer, setMovieFromServer] = useState<Movie | null>(null);
  const [movieExist, setMovieExist] = useState(true);

  const loadMovieByTitle = async () => {
    try {
      setLoading(true);
      const newMovie = await loadMovie(movieToFind);

      setLoading(false);
      if (newMovie.Response === 'False') {
        setMovieFromServer(null);
        setMovieExist(false);

        return;
      }

      const {
        Title,
        Plot,
        Poster,
        imdbID,
      } = newMovie;

      setMovieFromServer({
        title: Title,
        description: Plot,
        imgUrl: Poster,
        imdbUrl: `https://www.imdb.com/title/${imdbID}/`,
        imdbId: imdbID,
      });
      setMovieExist(true);
      setMovieToFind('');
    } catch (e) {
      const error = e as Error;
      // eslint-disable-next-line
      console.log(error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovieExist(true);
    setMovieToFind(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMovieByTitle();
  };

  const addNewMovie = () => {
    if (movieFromServer) {
      addMovie(movieFromServer);
      setMovieFromServer(null);
    }

    setMovieToFind('');
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                { 'is-danger': !movieExist },
              )}
              value={movieToFind}
              onChange={handleChange}
            />
          </div>

          {!movieExist && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addNewMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {
          loading ? (
            <h2>Loading...</h2>
          ) : (
            movieFromServer && (
              <>
                <h2 className="title">Preview</h2>
                <MovieCard {...movieFromServer} />
              </>
            )
          )
        }
      </div>
    </>
  );
};
