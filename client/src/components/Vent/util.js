export const commentVent = (commentString, context, vent, addComment) => {
  context.socket.emit("comment_problem", commentString, vent._id, returnObj => {
    const { comment, message, success } = returnObj;
    if (success) {
      //addComment({ comment });
    } else context.notify({ message, type: "danger" });
  });
};

export const findPossibleUsersToTag = (commentString, socket, ventID) => {
  const reg = /\B\@\w+/g;
  const taggedUserList = commentString.match(reg);

  let lastTypedTag;
  if (taggedUserList) lastTypedTag = taggedUserList[taggedUserList.length - 1];
  if (lastTypedTag) {
    const currentTypingTag = commentString.slice(
      commentString.length - lastTypedTag.length,
      commentString.length
    );
    const isUserStillTaggingUser = currentTypingTag === lastTypedTag;

    if (isUserStillTaggingUser) {
      socket.emit(
        "find_relevant_users_to_tag",
        { currentTypingTag, ventID },
        resultObj => {}
      );
    } else {
    }
  } else {
  }
};

export const getVentComments = (context, handleChange, vent) => {
  context.socket.emit("get_problem_comments", vent._id, returnObj => {
    const { comments, message, success } = returnObj;

    if (success) handleChange({ comments });
    else context.notify({ message, type: "danger" });
  });
};
export const likeVent = (context, vent, updateVentLikes) => {
  context.socket.emit("like_problem", vent._id, returnObj => {
    const { message, success } = returnObj;

    if (success) {
      //updateVentLikes(returnObj);
    } else {
      context.notify({
        message,
        type: "danger"
      });
    }
  });
};

export const reportVent = (
  context,
  history,
  id,
  option,
  pathname,
  ventIndex
) => {
  context.socket.emit(
    "report_problem",
    { option, problemID: id },
    returnObj => {
      const { message, success } = returnObj;

      if (success && pathname.substring(0, 9) === "/problem/")
        history.push("/trending/reported");
      else if (success) context.removeVent(ventIndex);
      else
        context.notify({
          message,
          type: "danger"
        });
    }
  );
};

export const unlikeVent = (context, vent, updateVentLikes) => {
  context.socket.emit("unlike_problem", vent._id, returnObj => {
    const { message, success } = returnObj;

    if (success) {
      //updateVentLikes(returnObj);
    } else {
      context.notify({
        message,
        type: "danger"
      });
    }
  });
};