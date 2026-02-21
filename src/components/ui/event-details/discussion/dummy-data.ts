import { TDiscussionPost } from "./discussion.types";

export const DUMMY_POSTS: TDiscussionPost[] = [
  {
    id: "1",
    user: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?u=1",
      initials: "JD"
    },
    content:
      "Just reached the base camp! The view is absolutely breathtaking. Can't wait for the summit push tomorrow. 🏔️",
    images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"],
    upvotes: 24,
    downvotes: 2,
    commentsCount: 5,
    createdAt: "2 hours ago",
    comments: [
      {
        id: "c1",
        user: {
          name: "Sarah Smith",
          avatar: "https://i.pravatar.cc/150?u=2",
          initials: "SS"
        },
        content: "Stay safe out there! Looking forward to more photos.",
        createdAt: "1 hour ago"
      },
      {
        id: "c2",
        user: {
          name: "Mike Johnson",
          avatar: "https://i.pravatar.cc/150?u=3",
          initials: "MJ"
        },
        content: "That looks amazing. What gear are you using?",
        createdAt: "45 mins ago"
      }
    ]
  },
  {
    id: "2",
    user: {
      name: "Alice Wang",
      avatar: "https://i.pravatar.cc/150?u=4",
      initials: "AW"
    },
    content:
      "Does anyone know if there's reliable water source near the second campsite? We're planning to stop there for lunch.",
    images: [],
    upvotes: 12,
    downvotes: 0,
    commentsCount: 3,
    createdAt: "5 hours ago",
    comments: []
  },
  {
    id: "3",
    user: {
      name: "Bob Wilson",
      avatar: "https://i.pravatar.cc/150?u=5",
      initials: "BW"
    },
    content:
      "Check out these shots from last week's scouting trip! The trail conditions are pretty good, though a bit muddy in the lowlands.",
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306",
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b"
    ],
    upvotes: 45,
    downvotes: 1,
    commentsCount: 8,
    createdAt: "Yesterday",
    comments: []
  }
];
