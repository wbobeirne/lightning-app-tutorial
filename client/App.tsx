import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import PostForm from 'components/PostForm';
import Posts from 'components/Posts';
import './App.scss';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Container>
          <h1 className="App-title">Lightning Posts</h1>
          <Row className="justify-content-md-center">
            <Col xs={12} sm={8}>
              <PostForm />
              <Posts />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
