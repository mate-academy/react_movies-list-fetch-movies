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
  const [queryInput, setQueryInput] = useState('');
  const [movieToDisplay, setMovieToDisplay] = useState<Movie | null>();
  const [errorTitle, setErrorTitle] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const createMovie = (movie: MovieData) => {
    const {
      Title,
      Plot,
      Poster,
      imdbID,
    } = movie;

    setMovieToDisplay({
      title: Title,
      description: Plot,
      imdbId: imdbID,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imgUrl: Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : Poster,
    });
  };

  const handleFindBy = async (event:
  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setLoading(true);
    const movieFromServer = await getMovie(queryInput);

    if ('Error' in movieFromServer) {
      setErrorTitle(true);
    } else {
      createMovie(movieFromServer);
    }

    setLoading(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryInput(event.target.value);
    setErrorTitle(false);
  };

  const handleReset = () => {
    if (movieToDisplay) {
      handleAddMovie(movieToDisplay);
      setQueryInput('');
      setMovieToDisplay(null);
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
              value={queryInput}
              onChange={handleChange}
            />
          </div>

          {errorTitle
            && (
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
              className={isLoading ? 'button is-loading' : 'button is-light'}
              disabled={!queryInput}
              onClick={(event) => handleFindBy(event)}
            >
              Find a movie
            </button>
          </div>

          {movieToDisplay
            && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={handleReset}
                >
                  Add to the list
                </button>
              </div>
            )}
        </div>
      </form>

      {movieToDisplay
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movieToDisplay} />
          </div>
        )}
    </>
  );
};
