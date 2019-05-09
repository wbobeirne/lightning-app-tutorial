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
import api from 'lib/api';
import { Post } from 'types';

interface State {
  name: string;
  content: string;
  isPosting: boolean;
  pendingPost: null | Post;
  paymentRequest: null | string;
  error: null | string;
}

export default class PostForm extends React.Component<{}, State> {
  state: State = {
    name: '',
    content: '',
    isPosting: false,
    pendingPost: null,
    paymentRequest: null,
    error: null,
  }

  render() {
    const { name, content, isPosting, error, paymentRequest } = this.state;
    const disabled = !content.length || !name.length || isPosting;

    let cardContent;
    if (paymentRequest) {
      cardContent = (
        <div className="PostForm-pay">
          <FormGroup>
            <Input
              value={paymentRequest}
              type="textarea"
              rows="5"
              disabled
            />
          </FormGroup>
          <Button color="primary" block href={`lightning:${paymentRequest}`}>
            Open in Wallet
          </Button>
        </div>
      );
    } else {
      cardContent = (
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
      );
    }

    return (
      <Card className="mb-4">
        <CardHeader>
          Submit a Post
        </CardHeader>
        <CardBody>
          {cardContent}
        </CardBody>
      </Card>
    );
  }

  private handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({ [ev.target.name]: ev.target.value } as any);
  };

  private handleSubmit = (ev: React.FormEvent) => {
    const { name, content } = this.state;
    ev.preventDefault();

    this.setState({
      isPosting: true,
      error: null,
    });

    api.submitPost(name, content)
      .then(res => {
        this.setState({
          isPosting: false,
          pendingPost: res.post,
          paymentRequest: res.paymentRequest,
        });
        this.checkIfPaid();
      }).catch(err => {
        this.setState({
          isPosting: false,
          error: err.message,
        })
      });
  };

  // Check if they've paid their invoice after a delay. Check again if they
  // haven't paid yet. Reload the page if they have.
  private checkIfPaid = () => {
    setTimeout(() => {
      const { pendingPost } = this.state;
      if (!pendingPost) return;

      api.getPost(pendingPost.id).then(p => {
        if (p.hasPaid) {
          window.location.reload();
        } else {
          this.checkIfPaid();
        }
      });
    }, 1000);
  };
}
