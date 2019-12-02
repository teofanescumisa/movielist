import React, { Fragment } from "react";
import { Card, Button, Icon } from "antd";
const IMAGE_PATH = "https://image.tmdb.org/t/p/w200/";
const { Meta } = Card;

const MovieList = props => {
  const { movies, onRemoveMovie, onRatingChange } = props;
  return movies.map(movie => {
    return (
      <Card
        key={movie.id}
        cover={
          <img
            src={IMAGE_PATH + movie.poster_path}
            alt={`Poster of ${movie.title}`}
          />
        }
        actions={[
          <Button
            key="delete"
            type="danger"
            onClick={() => onRemoveMovie(movie.id)}
          >
            <Icon type="delete" theme="filled" />
            Remove
          </Button>
        ]}
      >
        <Meta
          title={movie.title}
          description={
            <Fragment>
                           <div className="movie_genres">{movie.genres}</div>
              <div className="movie_votes">
                {movie.vote_average}
                <div className="movie_rating">
                  {[...Array(10)].map((item, i) => (
                    <Icon
                      key={i}
                      type="star"
                      theme={movie.rating && movie.rating > i && "filled"}
                      onClick={() => onRatingChange(movie.id, i)}
                    />
                  ))}
                  {movie.rating && (
                    <span className="movie_rating_value">{movie.rating}</span>
                  )}
                </div>
                </div>
                <div className="movie_description">{movie.overview}</div>
            </Fragment>
          }
        />
      </Card>
    );
  });
};
export default MovieList;