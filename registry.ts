import type { Task, TaskModule } from "./types.d.ts";
// deno-lint-ignore no-explicit-any
const g = globalThis as any;
const globalId = "__rt_tasks_registry__";

function ensureSet() {
    let set = g[globalId] as TaskModule[] | undefined;
    if (!set) {
        set = [];
        g[globalId] = set;
    }

    return set;
}

/**
 * Prepends a task module to the registry by id.
 * If a module with the id has an index of zero, the module will be moved to the beginning of the registry.
 * If no module with the id is found, the module will be appended to the registry.
 * Otherwise, the module will be inserted before the module with the given matching id.
 *
 * @param id - The ID of the module.
 * @param module - The task module to prepend to the registry.
 */
export function prependRegisterTask(id: string, module: TaskModule): boolean {
    const set = ensureSet();
    const index = set.findIndex((mod) => mod.id === id);
    if (index === 0) {
        set.unshift(module);
        return true;
    }

    if (index !== -1) {
        set.splice(index - 1, 0, module);
        return true;
    }

    set.push(module);
    return false;
}

/**
 * Registers a task module.
 * If a module with the same ID already exists, it will be replaced with the new module.
 * @param module - The task module to register.
 */
export function registerTask(module: TaskModule) {
    const set = ensureSet();

    const index = set.findIndex((mod) => mod.id === module.id);
    if (index !== -1) {
        set[index] = module;
        return;
    }

    set.push(module);
}

/**
 * Finds a task module and task by matching the provided node.
 *
 * @param node - The node to match against.
 * @returns An object containing the matching task module and task, or undefined if no match is found.
 */
export function findTaskByNode(node: Record<string, unknown>): { mod: TaskModule; task: Task } | undefined {
    const set = ensureSet();
    for (const mod of set) {
        if (!mod.parseNode) {
            continue;
        }

        const task = mod.parseNode(node);
        if (task) {
            return { mod, task };
        }
    }

    return undefined;
}

/**
 * Finds a TaskModule that matches the given task.
 *
 * @param task - The task to match against.
 * @returns The matching TaskModule, or undefined if no match is found.
 */
export function findTaskByType(task: Task): TaskModule | undefined {
    const set = ensureSet();
    for (const mod of set) {
        if (!mod.match) {
            continue;
        }

        if (mod.match(task)) {
            return mod;
        }
    }
}

/**
 * Finds a module by its ID.
 * @param id - The ID of the module to find.
 * @returns The found TaskModule, or undefined if not found.
 */
export function findTaskModule(id: string): TaskModule | undefined {
    const set = ensureSet();
    return set.find((mod) => mod.id === id);
}
