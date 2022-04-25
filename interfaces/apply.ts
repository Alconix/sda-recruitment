export interface Apply {
  id: string;
  author_id: string;
  content: string[];
  date: Date;
  status: string;
  comments: Comment[];
  votes: Vote[];
}

export interface Comment {
  id: string;
  author_id: string;
  date: Date;
  content: string;
}

export interface Vote {
  id: string;
  user_id: string;
  value: number;
}
