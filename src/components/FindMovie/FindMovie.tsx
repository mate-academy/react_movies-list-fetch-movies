import React, { FormEvent, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
// import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

interface FindMovieProps {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<FindMovieProps> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieTitle, setMovieTitle] = useState<string>('');
  const [notFoundMovie, setNotFoundMovie] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchForMovie = async (event: FormEvent) => {
    let searchedMovie: MovieData | ResponseError;

    event.preventDefault();
    setIsLoading(true);

    try {
      searchedMovie = await getMovie(movieTitle);

      if ('Title' in searchedMovie) {
        const defaultPoster
          = 'https://via.placeholder.com/360x270.png?text=no%20preview';
        const {
          Title, Plot, Poster, imdbID,
        } = searchedMovie;

        setMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster || defaultPoster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });
      } else {
        setNotFoundMovie(movieTitle);
      }
    } catch (error) {
      return error;
    } finally {
      setIsLoading(false);
    }

    return 0;
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => searchForMovie(event)}
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
              onChange={(event) => {
                setMovieTitle(event.target.value);
                setNotFoundMovie('');
              }}
            />
          </div>

          {movieTitle && movieTitle === notFoundMovie && (
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!movieTitle}
            >
              {`${!movie ? 'Find a movie' : 'Search Again'}`}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addMovie(movie);
                  setMovie(null);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
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
