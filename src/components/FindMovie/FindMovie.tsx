/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovieFromServer } from '../../api/api';
import { MovieCard } from '../MovieCard';

type Props = {
  handleSetMovies(movie: Movie): void;
};

export const FindMovie: React.FC<Props> = ({ handleSetMovies }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isInputChanged, setIsInputChanged] = useState<boolean>(false);
  const [isFindButtonClicked, setIsFindButtonClicke] = useState<boolean>(false);

  const findMovie = async (title: string) => {
    try {
      const movieFromServer = await getMovieFromServer(title);

      if (movieFromServer.Response === 'True') {
        setMovie(movieFromServer);
      } else {
        setMovie(null);
      }
    } catch {
      throw new Error('Loading failed');
    }

    setIsFindButtonClicke(true);
  };

  const handleInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setIsInputChanged(true);
  };

  const handleAddMovieToTheList = (foundMovie: Movie) => {
    if (foundMovie) {
      handleSetMovies(foundMovie);
    }

    setInputValue('');
    setIsInputChanged(false);
    setIsFindButtonClicke(false);
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
              className="input is-danger"
              value={inputValue}
              onChange={handleInputChanged}
            />
          </div>

          {
            (!movie && isInputChanged && inputValue && isFindButtonClicked) && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
          }

          {
            ((isInputChanged && !inputValue) || (!inputValue && isFindButtonClicked)) && (
              <p className="help is-danger">
                Please enter title of the film
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => findMovie(inputValue)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => movie && handleAddMovieToTheList(movie)}
              disabled={!isFindButtonClicked || !movie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {
          movie && <MovieCard movie={movie} />
        }
      </div>
    </>
  );
};
