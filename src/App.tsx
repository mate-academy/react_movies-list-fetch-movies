import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieContext } from './components/moviecontext/moviecontext';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [movielist, setMovielist] = useState<Movie[]>([]);

  const [query, setQuery] = useState<string>('');
  const [showMovieList, setShowMovieList] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // console.log('query', query);

  const onQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsLoading(false);
  };

  // onfiltered pega o valor da query no form de findmovie e atualiza movie e movie é passado para moviecard

  const handleSubmit = (filmName: string) => {
    if (!filmName) {
      return;
    }

    setShowLoader(true);
    getMovie(filmName) // getMovie precisa de query para econtrar o filme
      .then(result => {
        // then faz a busca, se o result(que é a busca) for bem sucedida(encontrou o filme) 'true'
        if (result.Response === 'True') {
          setIsLoading(false);
          const foundFilm: Movie = {
            title: result.Title,
            description: result.Plot,
            imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
            imgUrl:
              !result.Poster || result.Poster === 'N/A'
                ? `https://via.placeholder.com/360x270.png?text=no%20preview`
                : result.Poster,
            imdbId: result.imdbID,
          }; // atualiza o setMovies com o resultado da busca Search

          setMovies([foundFilm]);
          setMovie(foundFilm);
        } else {
          setMovies([]);
          setIsLoading(true);
        }
      })
      .catch(erro => {
        // eslint-disable-next-line no-console
        console.error('error in request:', erro);
        setIsLoading(true);
      })
      .finally(() => setShowLoader(false));
  };

  const handleShowMoveList = (show: boolean) => {
    setShowMovieList(show);
  };

  const handleAddToList = () => {
    if (!movie) {
      return;
    }
    // aqui adiciona o filme que esta em movie(movie é atualizado por onFiltered)

    if (movielist.some(m => m.imdbId === movie?.imdbId)) {
      setQuery('');
      setMovie(undefined);
    } else {
      setMovielist(prev => [...prev, movie]);
    }

    setQuery('');
    setMovie(undefined);
  };

  // console.log('movies', movies);
  // console.log('movie', movie);
  // console.log('movielist', movielist);
  // console.log('haveOnTheList', haveOnTheList);
  // //console.log('fistSearchFilm', fistSearchFilm)
  // console.log('isloadin', isLoading);
  // console.log('showLoader', showLoader);

  return (
    <MovieContext.Provider
      value={{
        showLoader,
        movies,
        onQuery,
        query,
        handleSubmit,
        movie,
        handleShowMoveList,
        handleAddToList,
        movielist,
        isLoading,
      }}
    >
      <div className="page">
        <div className="page-content">{showMovieList && <MoviesList />}</div>

        <div className="sidebar">
          <FindMovie />
        </div>
      </div>
    </MovieContext.Provider>
  );
};
