import React, { useState } from 'react';
// import { getMovie } from '../../api';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

type Props = {
  getSelectedMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ getSelectedMovie }) => {
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [movieTitle, setMovieTitle] = useState('');
  const [isError, setIsError] = useState(false);

  const URL = 'https://www.omdbapi.com/?apikey=';

  const getMovie = async (title: string): Promise<Movie> => {
    const result = await fetch(`${URL}130e0d23&t=${title}`)
      .then(response => response.json());

    setFoundMovie(result);

    return result;
  };

  const handleFindMovie = async () => {
    const movie = await getMovie(movieTitle);

    if (movie.Response === 'False') {
      setIsError(true);
    }

    // eslint-disable-next-line no-console
    console.log(movie);

    return movie;
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          if (!foundMovie) {
            handleFindMovie();
          } else {
            getSelectedMovie(foundMovie);
            setMovieTitle('');
            setFoundMovie(null);
          }
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
              className="input is-danger"
              value={movieTitle}
              onChange={(event) => {
                if (isError) {
                  setIsError(false);
                }

                setMovieTitle(event.target.value);
              }}
            />
          </div>

          {isError ? (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          ) : null}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleFindMovie}
              data-cy="find"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (foundMovie) {
                  getSelectedMovie(foundMovie);
                }

                setFoundMovie(null);
                setMovieTitle('');
              }}
              data-cy="add"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {/* <h2 className="title">Preview</h2> */}
        {foundMovie && <MovieCard movie={foundMovie} />}
      </div>
    </>
  );
};
