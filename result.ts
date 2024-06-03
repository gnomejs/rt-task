import type { Task, TaskResultMeta, TaskStatus } from "./types.d.ts";

/**
 * Represents the result of a task execution.
 */
export class TaskResult implements TaskResultMeta {
    /**
     * The status of the task result.
     */
    status: TaskStatus;

    /**
     * The outputs produced by the task execution.
     */
    outputs?: Record<string, unknown>;

    /**
     * The error that occurred during the task execution, if any.
     */
    error?: Error;

    /**
     * The start time of the task execution.
     */
    startAt: Date;

    /**
     * The end time of the task execution.
     */
    endAt: Date;

    /**
     * The task associated with the result.
     */
    task: Task;

    /**
     * Creates a new instance of TaskResult.
     * @param task The task associated with the result.
     */
    constructor(task: Task) {
        this.task = task;
        this.status = "none";
        this.startAt = new Date();
        this.endAt = new Date();
    }

    /**
     * Starts the task.
     */
    start(): this {
        this.status = "running";
        this.startAt = new Date();
        return this;
    }

    /**
     * Ends the task and updates the status, outputs, and error.
     * @param status - The status of the task.
     * @param outputs - Optional. The outputs of the task.
     * @param error - Optional. The error that occurred during the task.
     */
    end(status?: TaskStatus, outputs?: Record<string, unknown>, error?: unknown): this {
        this.endAt = new Date();
        this.status = status ?? 'ok';
        this.outputs = outputs;
        if (error instanceof Error) {
            this.error = error;
        } else if (typeof error === 'string') {
            this.error = new Error(error);
        } else {
            this.error = new Error('An error occurred during task execution: ' + String(error));
        }

        return this;
    }
}
