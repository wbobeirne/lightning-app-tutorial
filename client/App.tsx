import React from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'reactstrap';
import ReactWebLNFallback from 'react-webln-fallback-reactstrap';
import PostForm from 'components/PostForm';
import Posts from 'components/Posts';
import api from 'lib/api';
import { Post } from 'types';
import './App.scss';

interface State {
  posts: Post[];
  isConnecting: boolean;
  error: Error | null;
}

// Starting state, can be used for "resetting" as well
const INITIAL_STATE: State = {
  posts: [],
  isConnecting: true,
  error: null,
};

export default class App extends React.Component<State> {
  state: State = { ...INITIAL_STATE };

  // Connect websocket immediately
  componentDidMount() {
    this.connect();
  }

  // Reset our state, connect websocket, and update state on new data or error
  private connect = () => {
    this.setState({ ...INITIAL_STATE });
    const socket = api.getPostsWebSocket();

    // Mark isConnecting false once connected
    socket.addEventListener('open', () => {
      this.setState({ isConnecting: false });
    });

    // Add new posts when they're sent
    socket.addEventListener('message', ev => {
      try {
        const msg = JSON.parse(ev.data.toString());
        if (msg && msg.type === 'post') {
          // Add new post, sort them by most recent
          const posts = [...this.state.posts, msg.data]
            .sort((a, b) => b.time - a.time);
          this.setState({ posts });
        }
      } catch(err) {
        console.error(err);
      }
    });

    // Handle closes and errors
    socket.addEventListener('close', () => {
      this.setState({
        isConnecting: false,
        error: new Error('Connection to server closed unexpectedly.'),
      });
    });
    socket.addEventListener('error', (ev) => {
      this.setState({
        isConnecting: false,
        error: new Error('There was an error, see your console for more information.'),
      });
      console.error(ev);
    });
  };

  render() {
    const { posts, isConnecting, error } = this.state;

    let content;
    if (isConnecting) {
      content = (
        <div className="d-flex justify-content-center p-5">
          <Spinner color="warning" style={{ width: '3rem', height: '3rem' }} />
        </div>
      );
    } else if (error) {
      content = (
        <Alert color="danger">
          <h4 className="alert-heading">Something went wrong!</h4>
          <p>{error.message}</p>
          <Button block outline color="danger" onClick={this.connect}>
            Try to reconnect
          </Button>
        </Alert>
      )
    } else {
      content = (
        <>
          <PostForm posts={posts} />
          <Posts posts={posts} />
        </>
      );
    }

    return (
      <div className="App">
        <Container>
          <h1 className="App-title">Lightning Posts</h1>
          <Row className="justify-content-md-center">
            <Col xs={12} sm={8}>
              {content}
            </Col>
          </Row>
        </Container>
        <ReactWebLNFallback />
      </div>
    );
  }
}
