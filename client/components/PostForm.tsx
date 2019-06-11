import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Input,
  Button,
  ButtonGroup,
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
  signature: string | undefined;
  isPosting: boolean;
  isSigning: boolean;
  pendingPost: null | Post;
  error: null | string;
}

const INITIAL_STATE: State = {
  name: '',
  content: '',
  signature: undefined,
  isPosting: false,
  isSigning: false,
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
        paymentComplete('preimage goes here');
        this.setState({ ...INITIAL_STATE });
      }
    }
  }

  render() {
    const { name, content, signature, isPosting, isSigning, error } = this.state;
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
                disabled={isPosting}
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
                disabled={isPosting || isSigning}
              />
            </FormGroup>

            {error && (
              <Alert color="danger">
                <h4 className="alert-heading">Failed to submit post</h4>
                <p>{error}</p>
              </Alert>
            )}

            <div>
              <Button
                className="mr-2"
                size="lg"
                color="primary"
                type="submit"
                disabled={disabled}
              >
                {isPosting ? (
                  <Spinner size="sm" />
                ) : (
                  <>Submit <small>({content.length} sats)</small></>
                )}
              </Button>
              <Button
                size="lg"
                color="secondary"
                outline
                disabled={isSigning || !content.length}
                onClick={this.signMessage}
              >
                {isSigning ? (
                  <Spinner size="sm" />
                ) : signature ? (
                  <>Message signed ✅</>
                ) : (
                  <>Sign content</>
                )}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    );
  }

  private handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({ [ev.target.name]: ev.target.value } as any);

    // Reset signature if they change content
    if (this.state.signature && ev.target.name === 'content') {
      this.setState({ signature: undefined });
    }
  };

  private signMessage = async () => {
    this.setState({ isSigning: true });

    try {
      const webln = await requestProvider();
      const sig = await webln.signMessage(this.state.content);
      this.setState({
        isSigning: false,
        signature: sig.signature
      });
    } catch(err) {
      this.setState({
        isSigning: false,
        error: err.message,
      });
    }
  };

  private handleSubmit = async (ev: React.FormEvent) => {
    const { name, content, signature } = this.state;
    ev.preventDefault();

    this.setState({
      isPosting: true,
      error: null,
    });

    try {
      // API request to setup post for payment
      const res = await api.submitPost(name, content, signature);
      this.setState({ pendingPost: res.post });
      // WebLN payment request
      const webln = await requestProvider();
      await webln.sendPayment(res.paymentRequest);
    } catch(err) {
      this.setState({
        pendingPost: null,
        isPosting: false,
        error: err.message,
      });
    }
  };
}
