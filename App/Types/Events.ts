// key:value pairs for event types
// this can also include some metadata in the future to allow for
// question / board / other data reference

export const EventKeys = {
  profile: {
    details: 'Updated profile details',
    notifications: 'Updated notifications settings',
  },
  thread: {
    newThread: 'Posted a new thread',
    newReply: 'Replied to a thread',
  },
  question: {
    newQuestion: 'Asked a new question',
    newAnswer: 'Replied to a question',
  },
  blog: {
    newArticle: 'Posted a new blog article',
    newComment: 'Commented on a blog article',
  },
};
