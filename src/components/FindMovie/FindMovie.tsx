import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [movie, setMovie] = useState<Movie | null>();
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');

  const getMovie = async (movieTitle: string) => {
    const response = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=ae79278e&t=[${movieTitle}]`);
    const movieFS = await response.json();

    return movieFS;
  };

  const handleFindMovie = async () => {
    if (title.trim() !== '') {
      const movieFS = await getMovie(title);

      if (movieFS.Response === 'True') {
        setMovie(movieFS);
      } else {
        setTitleError('Can not find a movie with such a title');
      }
    } else {
      setTitleError('Please input title');
    }
  };

  const handleAddMovie = () => {
    if (movie) {
      onAddMovie(movie);
      setMovie(null);
      setTitle('');
    }
  };

  return (
    <>
      <form
        className="find-movie"
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': titleError })}
              value={title}
              onChange={(event) => {
                setTitleError('');
                setTitle(event.target.value);
              }}
            />
          </div>

          {titleError.length > 0 && (
            <p className="help is-danger">
              {titleError}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={handleAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
