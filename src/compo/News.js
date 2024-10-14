import React, { Component } from 'react';
import Newsitem from './Newsitem';

export class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
    };
  }

  async componentDidMount() {
    this.fetchNews();
  }

  // Function to fetch news articles
  fetchNews = async () => {
    const { page } = this.state;
    let url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=da546f9be7ae4c4487452e71de7a02dd&page=${page}&pageSize=20`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
  };

  handleNext = async () => {
    if (this.state.page + 1 > Math.ceil(this.state.totalResults / 20)) {
      // Do nothing if there are no more pages
    } else {
      this.setState(
        (prevState) => ({
          page: prevState.page + 1,
        }),
        () => {
          this.fetchNews(); // Fetch the next page of news
        }
      );
    }
  };

  handlePrev = async () => {
    this.setState(
      (prevState) => ({
        page: prevState.page - 1,
      }),
      () => {
        this.fetchNews(); // Fetch the previous page of news
      }
    );
  };

  render() {
    return (
      <>
        <div className="container">
          <h1 className="container my-3 text-dark">Top Headlines</h1>

          <div className="row my-3">
            {this.state.articles.map((element) => {
              return (
                <div className="col md-4 my-1" key={element.url}>
                  <Newsitem
                    newsUrl={element.url}
                    imageUrl={element.urlToImage}
                    title={element.title ? element.title.slice(0, 20) : ""}
                    description={element.description ? element.description.slice(0, 50) : ""}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="d-flex justify-content-around">
          <button
            onClick={this.handlePrev}
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-primary"
          >
            &laquo; Previous
          </button>

          <button
            type="button"
            onClick={this.handleNext}
            className="btn btn-primary"
            disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / 20)}
          >
            Next &raquo;
          </button>
        </div>
      </>
    );
  }
}

export default News;
