export type TDiscussionUser = {
  name: string;
  avatar: string;
  initials: string;
};

export type TDiscussionComment = {
  id: string;
  user: TDiscussionUser;
  content: string;
  createdAt: string;
};

export type TDiscussionPost = {
  id: string;
  user: TDiscussionUser;
  content: string;
  images: string[];
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  createdAt: string;
  comments: TDiscussionComment[];
};
