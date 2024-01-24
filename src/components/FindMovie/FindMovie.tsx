import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

const DEFAULT_IMG = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  movies: Movie[];
  setMovies: (value: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [comparisonQuery, setComparisonQuery] = useState('');
  const [
    movieData,
    setMovieData,
  ] = useState<MovieData | ResponseError | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loader, setLoader] = useState(false);

  const handleFindButton = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    setLoader(true);
    getMovie(query).then(setMovieData).finally(() => setLoader(false));
    setComparisonQuery(query);
  };

  const handleAddButton = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    const isInclude = movies.some((mov: Movie) => mov.title === movie?.title);

    if (movie && !isInclude) {
      setMovies([...movies, movie]);
    }

    setQuery('');
    setMovie(null);
  };

  useEffect(() => {
    if (movieData?.Response === 'True') {
      setMovie({
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl:
          movieData.Poster === 'N/A'
            ? DEFAULT_IMG
            : movieData.Poster,
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      });
    }

    if (movieData?.Response === 'False') {
      setMovie(null);
    }
  }, [movieData]);

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
              className={cn('input', {
                'is-danger':
                  movieData?.Response === 'False'
                  && comparisonQuery === query,
              })}
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>

          {movieData?.Response === 'False' && comparisonQuery === query && (
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
              className={cn('button', {
                'is-light': !loader,
                'is-loading': loader,
              })}
              onClick={(e) => handleFindButton(e)}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddButton}
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
