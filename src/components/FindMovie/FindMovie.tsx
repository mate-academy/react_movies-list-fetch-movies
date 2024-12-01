import React, { useContext, useState } from 'react';
import './FindMovie.scss';
import { FindContext, MoviesContext } from '../../store';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const { findMovie, setFindMovie } = useContext(FindContext);
  const { movieData, setMovieData } = useContext(MoviesContext);
  const [error, setError] = useState<boolean>(false);
  const [firstSearch, setFirstSearch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const newMovie: Movie = {
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl:
      movieData.Poster && movieData.Poster !== 'N/A'
        ? movieData.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
    imdbId: movieData.imdbID,
  };

  const searchMovie = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsLoading(true);
    getMovie(findMovie).then(res => {
      if ('Error' in res) {
        setError(true);
        setFirstSearch(true);
        setIsLoading(false);

        return;
      }

      setMovieData(res);
      setError(false);
      setFirstSearch(true);
      setIsLoading(false);
    });
  };

  const addMovieToTheList = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setMovies(prevMovies => {
      for (const mov of prevMovies) {
        if (mov.description === newMovie.description) {
          return prevMovies;
        }
      }

      return [...prevMovies, newMovie];
    });
    setMovieData({
      Poster: '',
      Title: '',
      Plot: '',
      imdbID: '',
    });
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
              className={cn('input', { 'is-danger': error })}
              value={findMovie}
              onChange={e => {
                setFindMovie(e.target.value);
                setError(false);
              }}
            />
          </div>

          {error && (
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={!findMovie}
              onClick={searchMovie}
            >
              {!firstSearch ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movieData.Plot && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieToTheList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movieData.Title && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
