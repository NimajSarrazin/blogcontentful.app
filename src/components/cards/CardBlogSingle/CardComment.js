import { dataComments } from "@/data/dataComments";
import { Avatar } from "@nextui-org/react";

export default function CardComment() {
  return (
    <div className="container antialiased mx-auto max-w-screen-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">4 Comments</h3>
      <div className="space-y-4">
        {dataComments.map((comment, index) => (
          <div className="flex" key={index}>
            <div className="flex-shrink-0 mr-3">
              <Avatar
                size="large"
                src={comment.avatar}
                alt="avatar"
                className="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10"
              />
            </div>
            <div className="flex-1 border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
              <strong>{comment.name}</strong>{" "}
              <span className="text-xs text-gray-400">{comment.time}</span>
              <p className="text-sm">{comment.text}</p>
              <p className="text-sm font-bold"> Job: {comment.jobs}</p>
              <div className="mt-4 flex items-center">
                {comment.replies.length > 0 && (
                  <div className="flex -space-x-2 mr-2">
                    {comment.replies.map((reply, index) => (
                      <Avatar
                        key={index}
                        size="small"
                        src={reply}
                        alt="reply-avatar"
                        className="rounded-full w-6 h-6 border border-white"
                      />
                    ))}
                  </div>
                )}
                <div className="text-sm text-gray-500 font-semibold">
                  {comment.replies.length} Replies
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
