import React from 'react';
import { requestProvider } from 'webln';
import { Card, CardTitle, CardBody, CardText, Jumbotron, Button } from 'reactstrap';
import { Post } from 'types';

interface Props {
  posts: Post[];
}

export default class Posts extends React.Component<Props> {
  render() {
    const { posts } = this.props;

    let content;
    if (posts.length) {
      content = posts.map(p => (
        <Card key={p.id} className="mb-3">
          <CardBody>
            <CardTitle tag="h4">{p.name} says:</CardTitle>
            <CardText>{p.content}</CardText>
            {p.signature && (
              <Button
                color="success"
                size="sm"
                onClick={() => this.verifyMessage(p)}
              >
                Verify post content
              </Button>
            )}
          </CardBody>
        </Card>
      ));
    } else {
      content = (
        <Jumbotron>
          <h2 className="text-center">No posts yet.</h2>
          <p className="text-center">Why not be the first?</p>
        </Jumbotron>
      );
    }

    return (
      <>
        <h2>Latest Posts</h2>
        {content}
      </>
    );
  }

  private verifyMessage = async (post: Post) => {
    if (!post.signature) return;
    try {
      const webln = await requestProvider();
      await webln.verifyMessage(post.signature, post.content);
    } catch(err) {
      console.log(err);
    }
  };
}
