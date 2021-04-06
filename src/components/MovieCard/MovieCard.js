import React from 'react';
import './MovieCard.scss';

export const MovieCard = ({
  title,
  description,
  imgUrl,
  imdbUrl,
  Plot,
  Title,
  Poster,
}) => (
  <div className="card">
    <div className="card-image">
      <figure className="image is-4by3">
        <img
          src={imgUrl || Poster}
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
          <p className="title is-8">{title || Title}</p>
        </div>
      </div>

      <div className="content">
        {description || Plot}
        <br />
        <a href={imdbUrl}>IMDB</a>
      </div>
    </div>
  </div>
);
