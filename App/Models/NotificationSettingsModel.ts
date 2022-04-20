interface INotificationSettings {
  email: {
    article_comments: boolean;
    thread_replies: boolean;
    question_answers: boolean;
    private_messages: boolean;
  };
  live: {
    article_reacted: boolean;
    question_upvoted: boolean;
    thread_starred: boolean;
  };
}

interface INotificationSettingsModel {
  email: {
    articleComments: boolean;
    threadReplies: boolean;
    questionAnswers: boolean;
    privateMessages: boolean;
  };
  live: {
    articleReacted: boolean;
    questionUpvoted: boolean;
    threadStarred: boolean;
  };
}

export function NotificationSettingsModel(data: INotificationSettings): INotificationSettingsModel {
  return {
    email: {
      articleComments: data.email.article_comments,
      threadReplies: data.email.thread_replies,
      questionAnswers: data.email.question_answers,
      privateMessages: data.email.private_messages,
    },
    live: {
      articleReacted: data.live.article_reacted,
      questionUpvoted: data.live.question_upvoted,
      threadStarred: data.live.thread_starred,
    },
  };
}
