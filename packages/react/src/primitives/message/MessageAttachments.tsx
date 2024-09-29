"use client";

import { ComponentType, type FC, memo, useMemo } from "react";
import { useMessage, useMessageRuntime } from "../../context";
import { useMessageAttachment } from "../../context/react/AttachmentContext";
import { AttachmentRuntimeProvider } from "../../context/providers/AttachmentRuntimeProvider";
import { CompleteAttachment } from "../../types";

export type MessagePrimitiveAttachmentsProps = {
  components:
    | {
        Image?: ComponentType | undefined;
        Document?: ComponentType | undefined;
        File?: ComponentType | undefined;
        Attachment?: ComponentType | undefined;
      }
    | undefined;
};

const getComponent = (
  components: MessagePrimitiveAttachmentsProps["components"],
  attachment: CompleteAttachment,
) => {
  const type = attachment.type;
  switch (type) {
    case "image":
      return components?.Image ?? components?.Attachment;
    case "document":
      return components?.Document ?? components?.Attachment;
    case "file":
      return components?.File ?? components?.Attachment;
    default:
      const _exhaustiveCheck: never = type;
      throw new Error(`Unknown attachment type: ${_exhaustiveCheck}`);
  }
};

const AttachmentComponent: FC<{
  components: MessagePrimitiveAttachmentsProps["components"];
}> = ({ components }) => {
  const Component = useMessageAttachment((a) =>
    getComponent(components, a.attachment),
  );

  if (!Component) return null;
  return <Component />;
};

const MessageAttachmentImpl: FC<
  MessagePrimitiveAttachmentsProps & { attachmentIndex: number }
> = ({ components, attachmentIndex }) => {
  const messageRuntime = useMessageRuntime();
  const runtime = useMemo(
    () => messageRuntime.getAttachmentByIndex(attachmentIndex),
    [messageRuntime, attachmentIndex],
  );

  return (
    <AttachmentRuntimeProvider runtime={runtime}>
      <AttachmentComponent components={components} />
    </AttachmentRuntimeProvider>
  );
};

const MessageAttachment = memo(
  MessageAttachmentImpl,
  (prev, next) =>
    prev.attachmentIndex === next.attachmentIndex &&
    prev.components?.Image === next.components?.Image &&
    prev.components?.Document === next.components?.Document &&
    prev.components?.File === next.components?.File &&
    prev.components?.Attachment === next.components?.Attachment,
);

export const MessagePrimitiveAttachments: FC<
  MessagePrimitiveAttachmentsProps
> = ({ components }) => {
  const attachmentsCount = useMessage(({ message }) => {
    if (message.role !== "user") return 0;
    return message.attachments.length;
  });

  return Array.from({ length: attachmentsCount }, (_, index) => (
    <MessageAttachment
      key={index}
      attachmentIndex={index}
      components={components}
    />
  ));
};

MessagePrimitiveAttachments.displayName = "MessagePrimitive.Attachments";
