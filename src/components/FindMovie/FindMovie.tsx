import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { prepareMovie } from '../../Api/Api';
import { MovieCard } from '../MovieCard';

type Props = {
  pushMovie: (movie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ pushMovie }) => {
  const [title, setTitle] = useState('');
  const [isCorrectTitle, setIsCorrect] = useState(true);

  const [movie, setMovie] = useState<Movie>({
    Title: '',
    Poster: '',
    Plot: '',
    imdbID: '',
  });

  async function setMovieFromApi() {
    const neededMovie: Movie = await prepareMovie(title);

    setTitle('');

    if (!neededMovie.Title) {
      setIsCorrect(false);
    }

    setMovie(neededMovie);
  }

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          setMovieFromApi();
        }}
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
              value={title}
              className={classNames('input', { 'is-danger': !isCorrectTitle })}
              onChange={({ target }) => {
                setTitle(target.value);
                setIsCorrect(true);
              }}
            />
          </div>

          {!isCorrectTitle && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
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

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => movie.Title && (pushMovie(movie))}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie.Title ? (<MovieCard movie={movie} />) : 'No film'}
      </div>
    </>
  );
};
