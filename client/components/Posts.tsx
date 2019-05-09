import React from 'react';
import { Spinner, Card, CardTitle, CardBody, CardText, Alert } from 'reactstrap';
import { Post } from 'types';
import api from 'lib/api';

interface State {
  posts: null | Post[];
  isFetching: boolean;
  error: null | string;
}

export default class Posts extends React.Component<{}, State> {
  state: State = {
    posts: null,
    isFetching: false,
    error: null,
  };

  // As soon as this component mounts, start fetching posts
  componentDidMount() {
    this.getPosts();
  }

  render() {
    const { posts, isFetching, error } = this.state;

    let content;
    if (posts) {
      if (posts.length) {
        content = posts.map(p => (
          <Card key={p.id}>
            <CardBody>
              <CardTitle tag="h4">{p.name} says:</CardTitle>
              <CardText>{p.content}</CardText>
            </CardBody>
          </Card>
        ));
      } else {
        content = <h1>No posts yet!</h1>;
      }
    } else if (isFetching) {
      content = <Spinner size="lg" />;
    } else if (error) {
      content = (
        <Alert color="danger">
          <h4 className="alert-heading">Failed to fetch posts</h4>
          <p>{error}. <a onClick={this.getPosts}>Click here</a> to try again.</p>
        </Alert>
      );
    }

    return (
      <>
        <h2>Latest Posts</h2>
        {content}
      </>
    );
  }

  // Fetch posts from the API and update state
  private getPosts = () => {
    this.setState({ isFetching: true });
    api.getPosts().then(posts => {
      this.setState({
        posts,
        isFetching: false,
      });
    })
    .catch(err => {
      this.setState({
        error: err.message,
        isFetching: false,
      })
    });
  };
}
