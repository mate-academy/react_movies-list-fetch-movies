import { useState, FC } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovieToMovieList: (v: Movie) => void;
};

export const FindMovie: FC<Props> = ({ addMovieToMovieList }) => {
  const [movieSearch, setMovieSearch] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [loading, setLoading] = useState(false);
  const [cantFindMovie, setCantFindMovie] = useState(false);

  const movieSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCantFindMovie(false);
    setMovieSearch(e.target.value);
  };

  const findMovieHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setLoading(true);
    getMovie(movieSearch)
      .then(data => {
        if ('Error' in data) {
          setCantFindMovie(true);

          return;
        }

        const moviePoster = data.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : data.Poster;

        const newMovie = {
          title: data.Title,
          description: data.Plot,
          imgUrl: moviePoster,
          imdbUrl: 'https://www.imdb.com/title/',
          imdbId: data.imdbID,
        };

        setMovie(newMovie);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addToMovieListHandler = () => {
    if (movie) {
      addMovieToMovieList(movie);
    }

    setMovie(undefined);
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
              className={`input ${cantFindMovie && 'is-danger'}`}
              value={movieSearch}
              onChange={e => movieSearchHandler(e)}
            />
          </div>
          {
            cantFindMovie && (
              <p className="help is-danger" data-cy="errorMessage">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              // is-loading
              className={`button is-light ${loading && 'is-loading'}`}
              disabled={movieSearch.length === 0}
              onClick={e => findMovieHandler(e)}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addToMovieListHandler}
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
