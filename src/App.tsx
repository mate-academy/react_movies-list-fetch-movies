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

  setMovie = (movie: Movie) => {
    this.setState(state => {
      if (state.movies.find(m => m.imdbID === movie.imdbID)) {
        return state;
      }

      return { movies: [movie, ...state.movies] };
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
          <FindMovie onSetMovie={this.setMovie} />
        </div>
      </div>
    );
  }
}
