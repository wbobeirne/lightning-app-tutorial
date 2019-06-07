import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Input,
  Button,
  Alert,
  Spinner,
} from 'reactstrap';
import { requestProvider } from 'webln';
import { paymentComplete } from 'react-webln-fallback-reactstrap';
import api from 'lib/api';
import { Post } from 'types';

interface Props {
  posts: Post[];
}

interface State {
  name: string;
  content: string;
  isPosting: boolean;
  pendingPost: null | Post;
  error: null | string;
}

const INITIAL_STATE: State = {
  name: '',
  content: '',
  isPosting: false,
  pendingPost: null,
  error: null,
};

export default class PostForm extends React.Component<Props, State> {
  state = { ...INITIAL_STATE };


  componentDidUpdate() {
    const { posts } = this.props;
    const { pendingPost } = this.state;

    // Reset the form if our pending post comes in
    if (pendingPost) {
      const hasPosted = !!posts.find(p => pendingPost.id === p.id);
      if (hasPosted) {
        paymentComplete(pendingPost.content);
        this.setState({ ...INITIAL_STATE });
      }
    }
  }

  render() {
    const { name, content, isPosting, error } = this.state;
    const disabled = !content.length || !name.length || isPosting;

    return (
      <Card className="mb-4">
        <CardHeader>
          Submit a Post
        </CardHeader>
        <CardBody>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Input
                name="name"
                value={name}
                placeholder="Name"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Input
                name="content"
                value={content}
                type="textarea"
                rows="5"
                placeholder="Content (1 sat per character)"
                onChange={this.handleChange}
              />
            </FormGroup>

            {error && (
              <Alert color="danger">
                <h4 className="alert-heading">Failed to submit post</h4>
                <p>{error}</p>
              </Alert>
            )}

            <Button color="primary" size="lg" type="submit" block disabled={disabled}>
              {isPosting ? (
                <Spinner size="sm" />
              ) : (
                <>Submit <small>({content.length} sats)</small></>
              )}
            </Button>
          </Form>
        </CardBody>
      </Card>
    );
  }

  private handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({ [ev.target.name]: ev.target.value } as any);
  };

  private handleSubmit = async (ev: React.FormEvent) => {
    const { name, content } = this.state;
    ev.preventDefault();

    this.setState({
      isPosting: true,
      error: null,
    });

    try {
      const res = await api.submitPost(name, content);
      const webln = await requestProvider();
      await webln.sendPayment(res.paymentRequest);
    } catch(err) {
      this.setState({
        isPosting: false,
        error: err.message,
      });
    }
  };
}
