import { TaskCollection } from "./collection.ts";
import { assertEquals as equals } from "jsr:@std/assert@0.225.3";

Deno.test("add task to collection", () => {
    const collection = new TaskCollection();
    collection.add({ name: "task1" });
    equals(collection.length, 1);

    collection.add({ name: "task2" });
    equals(collection.length, 2);
});

Deno.test("get task from collection", () => {
    const collection = new TaskCollection();
    collection.add({ name: "task1" });
    equals(collection.length, 1);

    collection.add({ name: "task2" });
    equals(collection.length, 2);

    const task = collection.get("task1");
    equals(task?.name, "task1");
    equals(task?.id, "task1");
});

Deno.test("add with empty name", () => {
    const collection = new TaskCollection();
    collection.add({ name: "" });
    equals(collection.length, 1);

    const task = collection.get(0);
    equals(task?.name, "task-0");
    equals(task?.id, "task-0");

    collection.add({ name: "" });
    equals(collection.length, 2);

    const task2 = collection.get(1);
    equals(task2?.name, "task-1");
    equals(task2?.id, "task-1");
});

Deno.test("add name and normalize id", () => {
    const collection = new TaskCollection();
    collection.add({ name: "task 1" });
    equals(collection.length, 1);

    const task = collection.get(0);
    equals(task?.name, "task 1");
    equals(task?.id, "task-1");
});

Deno.test("add colon in name in yaml mode", () => {
    const collection = new TaskCollection();
    collection.yamlMode = true;
    collection.add({ name: "task:1" });
    equals(collection.length, 1);

    const task = collection.get(0);
    equals(task?.name, "task:1");
    equals(task?.id, "task-1");
});

Deno.test("get task by index from collection", () => {
    const collection = new TaskCollection();
    collection.add({ name: "task1" });
    equals(collection.length, 1);

    collection.add({ name: "task2" });
    equals(collection.length, 2);

    const task = collection.get(0);
    equals(task?.name, "task1");
    equals(task?.id, "task1");
});

Deno.test("set task by index in collection", () => {
    const collection = new TaskCollection();
    collection.add({ name: "task1" });
    equals(collection.length, 1);

    collection.add({ name: "task2" });
    equals(collection.length, 2);

    collection.set(0, { name: "task3" });
    equals(collection.length, 2);

    const task = collection.get(0);
    equals(task?.name, "task3");
    equals(task?.id, "task3");
});

Deno.test("remove task by index from collection", () => {
    const collection = new TaskCollection();
    collection.add({ name: "task1" });
    equals(collection.length, 1);

    collection.add({ name: "task2" });
    equals(collection.length, 2);

    const task = collection.remove(0);
    equals(collection.length, 1);
    equals(task?.name, "task1");
    equals(task?.id, "task1");
});
