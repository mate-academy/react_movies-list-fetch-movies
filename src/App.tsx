import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
// import { MovieCard } from './components/MovieCard';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [foundedFilm, setFoundedFilm] = useState<Movie | null>(null);
  const [isValid, setIsValid] = useState(true);

  const findMovieAction = (event: React.FormEvent, movieTitle: string) => {
    event.preventDefault();

    getMovie(movieTitle)
      .then(res => {
        if (!('Error' in res)) {
          const film: Movie = {
            title: res.Title,
            description: res.Plot,
            imdbId: res.imdbID,
            imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
            imgUrl: res.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : res.Poster,
          };

          setFoundedFilm(film);
          setIsValid(true);
        }

        if ('Error' in res) {
          setIsValid(false);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const addFilmToList = () => {
    if (foundedFilm
        && !(movies.some(movie => movie.imdbId === foundedFilm.imdbId))) {
      setMovies([...movies, foundedFilm]);
      setFoundedFilm(null);
    }

    if (foundedFilm
      && movies.some(movie => movie.imdbId === foundedFilm.imdbId)) {
      setFoundedFilm(null);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onSubmit={findMovieAction}
          isLoading={isLoading}
          changeIsLoading={setIsLoading}
          isValid={isValid}
          changeIsValid={() => setIsValid(true)}
          movie={foundedFilm}
          addFilmToList={addFilmToList}
        />
      </div>
    </div>
  );
};
