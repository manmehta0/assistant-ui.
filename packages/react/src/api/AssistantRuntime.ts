import { AssistantRuntimeCore } from "../runtimes/core/AssistantRuntimeCore";
import { NestedSubscriptionSubject } from "./subscribable/NestedSubscriptionSubject";
import { ModelConfigProvider } from "../types/ModelConfigTypes";
import { ThreadRuntime, ThreadRuntimeCoreBinding } from "./ThreadRuntime";

export class AssistantRuntime<
  TThreadRuntime extends ThreadRuntime = ThreadRuntime,
> implements AssistantRuntimeCore
{
  constructor(
    private _core: AssistantRuntimeCore,
    CustomThreadRuntime: new (
      binding: ThreadRuntimeCoreBinding,
    ) => TThreadRuntime,
  ) {
    this.thread = new CustomThreadRuntime(
      new NestedSubscriptionSubject({
        getState: () => this._core.thread,
        subscribe: (callback) => this._core.subscribe(callback),
      }),
    );
  }

  public readonly thread;

  public switchToNewThread() {
    return this._core.switchToNewThread();
  }

  public switchToThread(threadId: string): void;
  /**
   * @deprecated Use `switchToNewThread` instead. This will be removed in 0.6.0.
   */
  public switchToThread(threadId: string | null): void;
  public switchToThread(threadId: string | null) {
    return this._core.switchToThread(threadId);
  }

  public registerModelConfigProvider(provider: ModelConfigProvider) {
    return this._core.registerModelConfigProvider(provider);
  }

  // TODO events for thread switching
  /**
   * @deprecated Thread is now static and never gets updated. This will be removed in 0.6.0.
   */
  public subscribe(callback: () => void) {
    return this._core.subscribe(callback);
  }
}