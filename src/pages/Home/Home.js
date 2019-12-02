import React, { Component, Fragment } from "react";
import { Row, Col, Input, Button } from "antd";
import axios from "axios";
import settings from "../../config";
import ResultList from "./ResultList/ResultList";
import MovieList from "./MovieList/MovieList";
export class Home extends Component {
  state = {
    searchTerm: "",
    results: [],
    savedMovies: [],
    genres: [],
    isLoading: false
  };
  componentDidMount() {
    // Save the genres to state on mount to use in the app later
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${settings.APIKEY}&language=en-US`;
    this.setState({ isLoading: true });
    axios.get(url).then(res => {
      this.setState({ genres: res.data.genres, isLoading: false });
    });
    const savedMovies = JSON.parse(localStorage.getItem("saved-movies"));
    if (savedMovies) {
      this.setState({ savedMovies }, () => {
        console.log(this.state.savedMovies);
      });
    }
  }
  handleSearchChange = event => {
    const { value } = event.target;
    if (value.length === 0) {
      this.setState({ results: [] });
    }
    this.setState({
      searchTerm: value
    });
  };
  handleSearchClick = async event => {
    event.preventDefault();
    console.log(this.state.searchTerm);
    const url = `
    https://api.themoviedb.org/3/search/movie?api_key=${settings.APIKEY}&query=${this.state.searchTerm}`;
    // Async/Await example
    // let response = null;
    // try {
    //   response = await axios.get(url);
    // } catch (e) {
    //   console.log(e);
    // }
    // console.log(res.data);
    this.setState({ isLoading: true });
    axios.get(url).then(res => {
      this.setState({ results: res.data.results, isLoading: false });
      console.log(res.data);
    });
  };
  handleAddMovie = movie => {
    const { savedMovies, genres } = this.state;
    // Get the genre name for each genre id of the movie and put them into a string
    const movieGenres = movie.genre_ids
      .map(genre => genres.find(item => item.id === genre).name)
      .join(", ");

    // every time a movie is added to our list, add another key to the movie object that contains the movieGenre string
 // and the rating key that is null at first
 savedMovies.push({ ...movie, genres: movieGenres, rating: null });

 // Alternative method but different logic
 // (here we loop trough the genre array and find matching ids, instead of looping trought movie.genre_ids)
 //
 // const getMovieGenres = () => {
 //   const movieGenres = [];
 //   genres.forEach(genre => {
 //     if (movie.genre_ids.indexOf(genre.id) >= 0) {
 //       movieGenres.push(genre.name);
 //     }
 //   });
 //   return movieGenres.join(", ");
 // };
 // savedMovies.push({ ...movie, genres: getMovieGenres() });
 this.setState({ savedMovies, results: [], searchTerm: "" }, () => {
   localStorage.setItem(
     "saved-movies",
     JSON.stringify(this.state.savedMovies)
   );
 });
};
handleRemoveMovie = movieId => {
 const savedMovies = this.state.savedMovies.filter(
   item => item.id !== movieId
 );
 this.setState({ savedMovies }, () => {
   localStorage.setItem(
     "saved-movies",
     JSON.stringify(this.state.savedMovies)
   );
 });
};

handleRatingChange = (movieId, i) => {
 // map through savedMovies and search for the movie by comparing the ids
 // then change the rating value of the movie to (index + 1) of the icon that was clicked
 const savedMovies = this.state.savedMovies.map(item => {
   if (item.id === movieId) {
     item.rating = i + 1;
   }
   return item;
 });
 // update the state and then the localStorage
 this.setState({ savedMovies }, () => {
   localStorage.setItem(
     "saved-movies",
     JSON.stringify(this.state.savedMovies)
   );
 });
};

render = () => {
 const { searchTerm, isLoading } = this.state;
 return (
   <Fragment>
     <Row>
       <form onSubmit={this.handleSearchClick}>
         <Col span={8} offset={6}>
           <Input
             placeholder="Search for a movie"
             value={searchTerm}
             onChange={this.handleSearchChange}
             onPressEnter={this.handleSearchChange}
             allowClear
           />
         </Col>
         <Col span={2}>
           <Button
             loading={isLoading}
             block
             disabled={searchTerm.length < 2}
             type="primary"
             icon="search"
             onClick={this.handleSearchClick}
           >
             Search
           </Button>
         </Col>
       </form>
     </Row>
     <Row>
       <Col span={10} offset={6} className="result_container">
         <ResultList
           savedMovies={this.state.savedMovies}
           results={this.state.results}
           onAddMovie={this.handleAddMovie}
         />
       </Col>
     </Row>
     <Row>
       <Col span={20} offset={2} className="movie_list">
         {this.state.savedMovies.length > 0 && (
           <MovieList
             movies={this.state.savedMovies}
             onRemoveMovie={this.handleRemoveMovie}
             onRatingChange={this.handleRatingChange}
           />
         )}
       </Col>
     </Row>
   </Fragment>
 );
};
}