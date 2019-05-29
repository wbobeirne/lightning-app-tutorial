import { EventEmitter } from 'events';

// All logic and storage around posts happens in here. To keep things simple,
// we're just storing posts in memory. Every time you restart the server, all
// posts will be lost. For long term storage, you'd want to look into putting
// these into a database.

export interface Post {
  id: number;
  time: number;
  name: string;
  content: string;
  hasPaid: boolean;
};

class PostsManager extends EventEmitter {
  posts: Post[] = [];

  // Add a new post to the list
  addPost(name: string, content: string): Post {
    const post = {
      name,
      content,
      id: Math.floor(Math.random() * 100000000) + 1000,
      time: Date.now(),
      hasPaid: false,
    };
    this.posts.push(post);
    return post;
  }

  // Gets a particular post given an ID
  getPost(id: number): Post | undefined {
    return this.posts.find(p => p.id === id);
  }

  // Mark a post as paid
  markPostPaid(id: number) {
    let updatedPost;
    this.posts = this.posts.map(p => {
      if (p.id === id) {
        updatedPost = { ...p, hasPaid: true };
        return updatedPost;
      }
      return p;
    });

    if (updatedPost) {
      this.emit('post', updatedPost);
    }
  }

  // Return posts that have been paid for
  getPaidPosts() {
    return this.posts.filter(p => !!p.hasPaid);
  }
}

export default new PostsManager();
