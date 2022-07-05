import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[],
  setMovies: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies}) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');

  const [movieLoadError, setMovieLoadError] = useState(false);
  const [movieExistError, setMovieExistError] = useState(false);

  const loadMovie = async () => {
    try {
      const load = await getMovie(title);

      if (load.Title) {
        setSelectedMovie(load);
      }
    } catch {
      setSelectedMovie(null);
      setMovieLoadError(true);
    }
  };

  const addMovie = () => {
    if (selectedMovie) {
      setSelectedMovie(null);
      const isUnique = !(movies.find(uniqueMovie => uniqueMovie.imdbID
        === selectedMovie.imdbID));

      if (isUnique) {
        setMovies(selectedMovie);
      } else {
        setMovieExistError(true);
      }
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
          </div>

          {movieLoadError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {movieExistError && (
            <p className="help is-danger">
              Movie is already added.
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={loadMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {selectedMovie && (
          <MovieCard movie={selectedMovie} />
        )}
      </div>
    </>
  );
};
