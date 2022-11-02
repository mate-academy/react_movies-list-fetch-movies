import React, { useContext } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { AppContext } from '../AppProvider';
import './FindMovie.scss';
import { Button } from '../Button';

export const FindMovie: React.FC = () => {
  const {
    movies,
    setMovies,
    query,
    setQuery,
    movie,
    setMovie,
    isMovieExist,
    setIsMovieExist,
    isSearch,
    setIsSearch,
  } = useContext(AppContext);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setQuery(newValue);

    if (newValue === '' || newValue !== query) {
      setIsMovieExist(false);
    }
  };

  const checkMovie = (newMovie: Movie) => {
    return movies.some(film => film.imdbId === newMovie.imdbId);
  };

  const getMovieFromServer = async (appliedQuery: string) => {
    const newFilm = await getMovie(appliedQuery);

    setIsSearch(false);

    if ('Poster' in newFilm) {
      const {
        Poster,
        Title,
        Plot,
        imdbID,
      } = newFilm as MovieData;

      const movieImg = Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : Poster;

      const newMovieInList = {
        title: Title,
        description: Plot,
        imgUrl: movieImg,
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      };

      setIsMovieExist(false);
      setMovie(newMovieInList);
    } else {
      setIsMovieExist(true);
      setMovie(null);
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearch(true);
    getMovieFromServer(query);
  };

  const addingMovie = (newFilm: Movie) => {
    if (!checkMovie(newFilm)) {
      setMovies([...movies, newFilm]);
    }

    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSearch}
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
              value={query}
              onChange={handleInput}
            />
          </div>

          {isMovieExist && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <Button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isSearch },
              )}
              disabled={!query}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </Button>
          </div>

          {movie && (
            <div className="control">
              <Button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addingMovie(movie)}
              >
                Add to the list
              </Button>
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
