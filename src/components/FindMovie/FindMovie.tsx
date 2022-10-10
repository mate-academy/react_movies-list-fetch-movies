import React, { useState } from 'react';
import { getMovie } from '../../api';
// import { MovieData } from '../../types/MovieData';
// import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

// const defaultMovie = {
//   title: '',
//   description: '',
//   imgUrl: '',
//   imdbUrl: '',
//   imdbId: '',
// };

interface Props {
  addMovie: (movie: Movie) => void;
}

const defaultImage
  = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieIsNotFound, setMovieIsNotFound] = useState(false);
  const [movie, setMovie] = useState<Movie>();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          setLoading(true);

          getMovie(movieTitle)
            .then((result) => {
              if ('Error' in result) {
                setMovieIsNotFound(true);
              } else {
                setMovie({
                  title: result.Title,
                  description: result.Plot,
                  imgUrl: result.Poster !== 'N/A'
                    ? result.Poster : defaultImage,
                  imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
                  imdbId: result.imdbID,
                });
              }
            })
            .finally(() => setLoading(false));
        }}
      >
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
              value={movieTitle}
              onChange={event => {
                setMovieTitle(event.target.value);
                setMovieIsNotFound(false);
              }}
            />
          </div>

          {movieIsNotFound && (
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
              className={`button ${loading ? 'is-loading' : 'is-light'}`}
              disabled={!movieTitle.length}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addMovie(movie);
                  setMovieTitle('');
                  setMovie(undefined);
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
