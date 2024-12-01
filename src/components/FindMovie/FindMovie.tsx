import { useState } from 'react';
import cn from 'classnames';

import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard/MovieCard';
import { Movie } from '../../types/Movie';

type FindMovieProps = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  movies: Movie[];
};

export const FindMovie: React.FC<FindMovieProps> = ({ setMovies, movies }) => {
  const [title, setTitle] = useState('');
  const [moviePreview, setMoviePreview] = useState<Movie | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [movieFound, setMovieFound] = useState(true);

  const transformMovieDataToMovie = (movieData: MovieData): Movie => {
    return {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl:
        movieData.Poster !== 'N/A'
          ? movieData.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
      imdbId: movieData.imdbID,
    };
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setMovieFound(true);
  };

  const handleSearchMovie = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoaded(true);

    const isValidtitle = title.length > 0;

    if (!isValidtitle) {
      return;
    }

    getMovie(title)
      .then((response: MovieData | ResponseError) => {
        if ('Error' in response) {
          setMovieFound(false);

          return;
        }

        const movie = transformMovieDataToMovie(response);

        setMoviePreview(movie);
        setMovieFound(true);
      })
      .finally(() => {
        setIsLoaded(false);
      });
  };

  const handleAddMovie = () => {
    if (!moviePreview) {
      return;
    }

    setMovies((prevMovies: Movie[]) => {
      const isMovieAlreadyAdded = movies.some(
        movie => movie.imdbId === moviePreview.imdbId,
      );

      if (isMovieAlreadyAdded) {
        return prevMovies;
      }

      return [...prevMovies, moviePreview];
    });

    setMoviePreview(null);
    setTitle('');
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
              className="input is-danger"
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
            />
          </div>

          {!movieFound && (
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
                'is-loading': isLoaded,
              })}
              onClick={e => handleSearchMovie(e)}
              disabled={isLoaded || !title}
            >
              {moviePreview ? 'Search again' : 'Find a movie'}
            </button>
          </div>
          {moviePreview && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {moviePreview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={moviePreview} />
        </div>
      )}
    </>
  );
};
