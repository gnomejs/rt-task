import { TaskBuilder } from "./builder.ts";
import type { Task } from "./types.d.ts";
import { StringBuilder } from "@gnome/strings";
import { CHAR_COLON, CHAR_HYPHEN_MINUS, CHAR_SPACE, CHAR_UNDERSCORE, isLetterOrDigit, isUpper } from "@gnome/char";

export function handleTaskId(task: Task, index: number, yaml?: boolean) {
    if (task.name === undefined || task.name === "") {
        task.name = `task-${index}`;
        if (!task.id) {
            task.id = `task-${index}`;
            return;
        }
    }

    if (task.id === undefined || task.id === "") {
        const name = task.name;
        const sb = new StringBuilder();
        for (let i = 0; i < name.length; i++) {
            let c = name.charCodeAt(i);

            if (c === CHAR_UNDERSCORE || c === CHAR_HYPHEN_MINUS) {
                sb.appendCode(c);
                continue;
            }

            if (c === CHAR_COLON) {
                if (yaml) {
                    sb.appendCode(CHAR_HYPHEN_MINUS);
                } else {
                    sb.appendCode(c);
                }
                continue;
            }

            if (c === CHAR_SPACE) {
                sb.appendCode(CHAR_HYPHEN_MINUS);
                continue;
            }

            if (isLetterOrDigit(c)) {
                if (isUpper(c)) {
                    c += 32;
                    sb.appendCode(c);
                    continue;
                }

                sb.appendCode(c);
            }
        }

        task.id = sb.toString();
    } else {
        for (let i = 0; i < task.id.length; i++) {
            const c = task.id.charCodeAt(i);
            if (isLetterOrDigit(c) || c === CHAR_UNDERSCORE || c === CHAR_HYPHEN_MINUS || c === CHAR_COLON) {
                if (c === CHAR_COLON && yaml) {
                    throw new Error(`Invalid character in task id: ${task[i]}`);
                }
                continue;
            }

            throw new Error(`Invalid character in task id: ${task[i]}`);
        }
    }
}

export class TaskCollection implements Iterable<Task>, Record<string, unknown> {
    #map: Map<string, Task> = new Map();
    #set: Task[] = [];

    get length(): number {
        return this.#set.length;
    }

    [key: string]: unknown;

    yamlMode: boolean = false;

    add(task: Task): TaskBuilder {
        handleTaskId(task, this.#set.length, this.yamlMode);
        this.#set.push(task);
        this.#map.set(task.id!, task);
        return new TaskBuilder(task);
    }

    addRange(tasks: Iterable<Task>): this {
        for (const task of tasks) {
            this.add(task);
        }

        return this;
    }

    clear(): void {
        this.#set.length = 0;
        this.#map.clear();
    }

    get(id: string | number): Task | undefined {
        if (typeof id === "number") {
            return this.#set[id];
        }

        return this.#map.get(id);
    }

    indexOf(task: Task): number {
        return this.#set.indexOf(task);
    }

    [Symbol.iterator](): Iterator<Task> {
        return this.#set.values();
    }

    set(index: number, task: Task) {
        if (index < 0 || index >= this.#set.length) {
            throw new RangeError(`Index out of range: ${index}`);
        }

        handleTaskId(task, index, this.yamlMode);

        const existing = this.#set.at(index);
        if (existing) {
            this.#map.delete(existing.id!);
        }

        this.#set[index] = task;
        this.#map.set(task.id!, task);

        return this;
    }

    remove(index: number): Task | undefined {
        if (index < 0 || index >= this.#set.length) {
            throw new RangeError(`Index out of range: ${index}`);
        }
        const removed = this.#set.splice(index, 1);
        if (removed.length === 0) {
            return undefined;
        }

        this.#map.delete(removed[0].id!);
        return removed[0];
    }

    toArray(): Task[] {
        return [...this.#set];
    }
}
