import type { LoggingMessageBus } from "@rt/message-bus/logging-bus";

/**
 * Represents the metadata of a task.
 */
export interface TaskMeta extends Record<string, unknown> {
    /**
     * The unique identifier of the task.
     */
    id?: string;

    /**
     * The name of the task.
     */
    name?: string;

    /**
     * The description of the task.
     */
    description?: string;

    /**
     * The list of task IDs that this task depends on.
     */
    needs?: string[];

    /**
     * The environment variables required for the task.
     */
    env?: Record<string, string | undefined>;
}

/**
 * Represents the state of a task.
 */
export interface TaskStates extends Record<string, unknown> {
    /**
     * The environment variables for the task.
     */
    env: Record<string, string | undefined>;

    /**
     * The secrets for the task.
     */
    secrets: Record<string, string | undefined>;

    /**
     * The outputs of the task.
     */
    outputs: Record<string, unknown>;

    /**
     * The metadata of the task.
     */
    task: TaskMeta;
}

/**
 * Represents the execution context of a task.
 */
export interface TaskExecutionContext extends TaskStates {
    /**
     * The task being executed.
     */
    task: Task;

    /**
     * An optional AbortSignal that can be used to cancel the task execution.
     */
    signal?: AbortSignal;

    /**
     * The logging message bus used for communication between tasks.
     */
    bus: LoggingMessageBus;

    /**
     * A function that evaluates the given code and returns the result.
     *
     * @param code The code to be evaluated.
     * @returns The result of the code evaluation.
     */
    eval: (code: string) => unknown;
}

/**
 * Represents the metadata of a task result.
 */
export interface TaskResultMeta {
    /**
     * The status of the task.
     */
    status: TaskStatus;

    /**
     * The outputs of the task.
     */
    outputs?: Record<string, unknown>;

    /**
     * The error that occurred during the task execution.
     */
    error?: Error;

    /**
     * The start time of the task.
     */
    startAt: Date;

    /**
     * The end time of the task.
     */
    endAt: Date;
}

/**
 * Represents the status of a task.
 * Possible values are:
 * - 'none': No status assigned.
 * - 'running': The task is currently running.
 * - 'ok': The task completed successfully.
 * - 'error': The task encountered an error.
 * - 'cancelled': The task was cancelled.
 * - 'skipped': The task was skipped.
 */
export type TaskStatus = "none" | "running" | "ok" | "error" | "cancelled" | "skipped" | "running";

/**
 * Represents a function that handles a task.
 *
 * @param ctx - The task execution context.
 * @returns A promise that resolves to the task status.
 */
export type TaskHandler = (ctx: TaskExecutionContext) => Promise<TaskStatus>;

/**
 * Represents a task.
 */
export interface Task extends TaskMeta {
    /**
     * The timeout for the task.
     * It can be a number, a function that returns a number, or a function that returns a promise that resolves to a number.
     */
    timeout?: number | ((states: TaskStates) => number) | ((states: TaskStates) => Promise<number>);

    /**
     * Specifies a condition that determines whether the task should be executed.
     * It can be a boolean, a function that returns a boolean, or a function that returns a promise that resolves to a boolean.
     */
    if?: boolean | ((states: TaskStates) => boolean) | ((states: TaskStates) => Promise<boolean>);

    /**
     * Specifies whether the task should continue executing even if an error occurs.
     * It can be a boolean, a function that returns a boolean, or a function that returns a promise that resolves to a boolean.
     */
    continueOnError?: boolean | ((states: TaskStates) => boolean) | ((states: TaskStates) => Promise<boolean>);
}

/**
 * Represents a task module.
 */
export interface TaskModule extends Record<string, unknown> {
    /**
     * The unique identifier of the task module.
     */
    id: string;

    /**
     * The handler function for the task module.
     */
    handler: TaskHandler;

    /**
     * An optional function that determines if a task matches the module.
     * @param task The task to be matched.
     * @returns A boolean indicating if the task matches the module.
     */
    match?: (task: Task) => boolean;

    /**
     * An optional function that parses a node and returns a task object.
     * @param node The node to be parsed.
     * @returns The parsed task object, or undefined if parsing fails.
     */
    parseNode?: (node: Record<string, unknown>) => Task | undefined;
}
