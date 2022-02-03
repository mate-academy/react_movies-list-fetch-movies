import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

interface State {
  movies: Movie[];
}

export class App extends Component<{}, State> {
  state: State = {
    movies: [],
  };

  setMovies = (newMovie: Movie) => {
    this.setState(prev => {
      if (prev.movies.some(movie => movie.imdbID === newMovie.imdbID)) {
        return prev;
      }

      return {
        movies: [...prev.movies, newMovie],
      };
    });
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie setMovies={this.setMovies} />
        </div>
      </div>
    );
  }
}
