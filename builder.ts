import type { Task, TaskStates } from "./types.d.ts";

/**
 * Represents a builder class for creating tasks.
 */
export class TaskBuilder {
    #task: Task;

    /**
     * Constructs a new TaskBuilder instance.
     * @param task The task object to build.
     */
    constructor(task: Task) {
        this.#task = task;
    }

    /**
     * Sets the ID of the task.
     * @param id The ID of the task.
     * @returns The TaskBuilder instance.
     */
    id(id: string): this {
        this.#task.id = id;
        return this;
    }

    /**
     * Sets the name of the task.
     * @param name The name of the task.
     * @returns The TaskBuilder instance.
     */
    name(name: string): this {
        this.#task.name = name;
        return this;
    }

    /**
     * Sets the description of the task.
     * @param description The description of the task.
     * @returns The TaskBuilder instance.
     */
    description(description: string): this {
        this.#task.description = description;
        return this;
    }

    /**
     * Sets the dependencies of the task.
     * @param needs The dependencies of the task.
     * @returns The TaskBuilder instance.
     */
    needs(...needs: string[]): this {
        this.#task.needs = needs;
        return this;
    }

    /**
     * Sets the environment variables of the task.
     * @param env The environment variables of the task.
     * @returns The TaskBuilder instance.
     */
    env(env: Record<string, string | undefined>): this {
        this.#task.env = env;
        return this;
    }

    /**
     * Sets the timeout of the task.
     * @param timeout The timeout of the task.
     * @returns The TaskBuilder instance.
     */
    timeout(timeout: number | ((states: TaskStates) => number) | ((states: TaskStates) => Promise<number>)): this {
        this.#task.timeout = timeout;
        return this;
    }

    /**
     * Sets the condition for executing the task.
     * @param condition The condition for executing the task.
     * @returns The TaskBuilder instance.
     */
    if(condition: boolean | ((states: TaskStates) => boolean) | ((states: TaskStates) => Promise<boolean>)): this {
        this.#task.if = condition;
        return this;
    }

    /**
     * Sets whether the task should continue on error.
     * @param condition Whether the task should continue on error.
     * @returns The TaskBuilder instance.
     */
    continueOnError(
        condition: boolean | ((states: TaskStates) => boolean) | ((states: TaskStates) => Promise<boolean>),
    ): this {
        this.#task.continueOnError = condition;
        return this;
    }
}
