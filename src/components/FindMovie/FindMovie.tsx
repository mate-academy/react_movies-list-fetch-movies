import React, { useState } from 'react';
import './FindMovie.scss';
import { moviesFromServer } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  setMovies: (movie: (Movie)[]) => void
  movies: Movie[] | null;
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [inputText, setInputText] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieError, setMovieError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dublicate, setDublicate] = useState<boolean>(false);
  const [disabledAdd, setDisabledAdd] = useState(true);

  const saveInputText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
    setMovieError(false);
  };

  const findMovies = async () => {
    const filmDataCard = await moviesFromServer(inputText);

    if (filmDataCard.Response === 'False') {
      setMovieError(true);

      return;
    }

    setIsLoading(true);
    await moviesFromServer(inputText);
    setInputText('');
    setMovie(await moviesFromServer(inputText));
    setIsLoading(false);
    setDublicate(false);
    setDisabledAdd(false);
  };

  const addMovies = () => {
    const dublicateMovie = movies?.find(m => m.imdbID === movie?.imdbID);

    if (dublicateMovie) {
      setDublicate(true);
      setDisabledAdd(true);

      return;
    }

    if (movie && movies) {
      setMovies([...movies, movie]);
    }

    setMovie(null);
    setDisabledAdd(true);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              onChange={saveInputText}
              value={inputText}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={movieError ? 'input is-danger' : 'input'}
            />
          </div>
          {movieError && (
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
              onClick={findMovies}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              disabled={disabledAdd}
              type="button"
              className="button is-primary"
              onClick={addMovies}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {dublicate && (
          <p className="help is-danger duplicate">This is a duplicate, please find another movie</p>
        )}
        {isLoading
          ? (
            <p>Loading...</p>
          ) : (
            <MovieCard movie={movie} />
          )}
      </div>
    </>
  );
};
