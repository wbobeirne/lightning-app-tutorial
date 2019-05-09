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

let posts: Post[] = [];

// Add a new post to the list
export function addPost(name: string, content: string): Post {
  const post = {
    name,
    content,
    id: Math.floor(Math.random() * 100000000) + 1000,
    time: Date.now(),
    hasPaid: false,
  };
  posts.unshift(post);
  return post;
}

// Gets a particular post given an ID
export function getPost(id: number): Post | undefined {
  return posts.find(p => p.id === id);
}

// Marks a particular post as hasPaid: true
export function markPostPaid(id: number) {
  posts = posts.map(p => {
    if (p.id === id) {
      return { ...p, hasPaid: true };
    }
    return p;
  });
}

// Return posts that have been paid for
export function getPaidPosts() {
  return posts.filter(p => !!p.hasPaid);
}
