import type { Task, TaskStates } from "./types.d.ts";

/**
 * Represents a base task.
 */
export class TaskBase implements Task {
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
     * The list of dependencies needed for the task.
     */
    needs?: string[];

    /**
     * The environment variables for the task.
     */
    env?: Record<string, string | undefined>;

    /**
     * The timeout duration for the task.
     * It can be a number, a function that returns a number, or a function that returns a promise resolving to a number.
     */
    timeout?: number | ((states: TaskStates) => number) | ((states: TaskStates) => Promise<number>);

    /**
     * The condition that determines whether the task should be executed.
     * It can be a boolean, a function that returns a boolean, or a function that returns a promise resolving to a boolean.
     */
    if?: boolean | ((states: TaskStates) => boolean) | ((states: TaskStates) => Promise<boolean>);

    /**
     * The flag that indicates whether the task should continue execution even if it encounters an error.
     * It can be a boolean, a function that returns a boolean, or a function that returns a promise resolving to a boolean.
     */
    continueOnError?: boolean | ((states: TaskStates) => boolean) | ((states: TaskStates) => Promise<boolean>);

    /**
     * Additional properties for the task.
     */
    [key: string]: unknown;

    /**
     * Initializes a new instance of the TaskBase class.
     */
    constructor(options?: Partial<Task>) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
