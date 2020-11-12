import React from 'react';
import './MovieCard.scss';
import { MovieCardPropTypesShape } from '../../PropTypesShapes';

export function MovieCard({ movie }) {
  const movieForList = {
    title: movie.Title,
    description: movie.Plot,
    imgUrl: movie.Poster,
    imdbId: movie.imdbID,
  };
  const { title, description, imgUrl, imdbId } = movieForList;

  return (
    <div className="card">
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            src={imgUrl}
            alt="Film logo"
          />
        </figure>
      </div>
      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <figure className="image is-48x48">
              <img
                src="images/imdb-logo.jpeg"
                alt="imdb"
              />
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-8">{title}</p>
          </div>
        </div>

        <div className="content">
          {description}
          <br />
          <a href={`https://www.imdb.com/title/${imdbId}/`}>IMDB</a>
        </div>
      </div>
    </div>
  );
}

MovieCard.propTypes = MovieCardPropTypesShape;
