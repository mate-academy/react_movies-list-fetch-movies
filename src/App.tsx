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

  addMovie = (newMovie: Movie) => {
    if (!this.state.movies.some(movie => movie.imdbID === newMovie.imdbID)) {
      this.setState(state => ({ movies: [...state.movies, newMovie] }));
    }
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie addMovie={this.addMovie} />
        </div>
      </div>
    );
  }
}
