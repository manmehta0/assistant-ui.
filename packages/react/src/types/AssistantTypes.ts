import { LanguageModelV1LogProbs } from "@ai-sdk/provider";
import type { ReactNode } from "react";

export type TextContentPart = {
  type: "text";
  text: string;
};

export type ImageContentPart = {
  type: "image";
  image: string;
};

export type UIContentPart = {
  type: "ui";
  display: ReactNode;
};

export type CoreToolCallContentPart<
  TArgs extends Record<string, unknown> = Record<string | number, unknown>,
  TResult = unknown,
> = {
  type: "tool-call";
  toolCallId: string;
  toolName: string;
  args: TArgs;
  result?: TResult | undefined;
  isError?: boolean | undefined;
};

export type ToolCallContentPart<
  TArgs extends Record<string, unknown> = Record<string | number, unknown>,
  TResult = unknown,
> = CoreToolCallContentPart<TArgs, TResult> & {
  argsText: string;
};

export type ThreadUserContentPart =
  | TextContentPart
  | ImageContentPart
  | UIContentPart;

export type ThreadAssistantContentPart =
  | TextContentPart
  | ToolCallContentPart
  | UIContentPart;

type MessageCommonProps = {
  id: string;
  createdAt: Date;
};

type MessageStatusBase = {
  logprobs?: LanguageModelV1LogProbs;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
};

export type ContentPartStatus =
  | {
      type: "running";
    }
  | {
      type: "complete";
    }
  | {
      type: "incomplete";
      finishReason: "cancelled" | "length" | "content-filter" | "other";
    }
  | {
      type: "incomplete";
      finishReason: "error";
      error?: unknown;
    };

export type ToolContentPartStatus =
  | {
      type: "requires-action";
      finishReason: "tool-calls";
    }
  | ContentPartStatus;

export type MessageStatus =
  | {
      type: "running";
    }
  | (MessageStatusBase &
      (
        | {
            type: "requires-action";
            finishReason: "tool-calls";
          }
        | {
            type: "complete";
            finishReason: "stop" | "unknown";
          }
        | {
            type: "incomplete";
            finishReason: "cancelled" | "length" | "content-filter" | "other";
          }
        | {
            type: "incomplete";
            finishReason: "error";
            error: unknown;
          }
      ));

export type ThreadSystemMessage = MessageCommonProps & {
  role: "system";
  content: [TextContentPart];
};

export type ThreadUserMessage = MessageCommonProps & {
  role: "user";
  content: ThreadUserContentPart[];
};

export type ThreadAssistantMessage = MessageCommonProps & {
  role: "assistant";
  content: ThreadAssistantContentPart[];
  status: MessageStatus;
};

export type AppendMessage = CoreMessage & {
  parentId: string | null;
};

export type ThreadMessage =
  | ThreadSystemMessage
  | ThreadUserMessage
  | ThreadAssistantMessage;

/** Core Message Types (without UI content parts) */

export type CoreUserContentPart = TextContentPart | ImageContentPart;
export type CoreAssistantContentPart =
  | TextContentPart
  | CoreToolCallContentPart;

export type CoreSystemMessage = {
  role: "system";
  content: [TextContentPart];
};

export type CoreUserMessage = {
  role: "user";
  content: CoreUserContentPart[];
};

export type CoreAssistantMessage = {
  role: "assistant";
  content: CoreAssistantContentPart[];
};

export type CoreMessage =
  | CoreSystemMessage
  | CoreUserMessage
  | CoreAssistantMessage;
