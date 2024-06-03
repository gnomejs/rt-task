# @rt/task

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

The core tasks primitives for rt that enables creating
custom tasks.

## Basic Usage

```typescript
import { 
    TaskBase, 
    TaskResult,
    registerTask, 
    type Task, 
    type TaskExecutionContext
} from str from '@rt/task'

export class SimpleTask extends TaskBase {
    run: (ctx: TaskExecutionContext) => Promise<void>
}

registerTask({
    id: "simple-task",
    match: function(task: Task) {
        return task instanceof SimpleTask
    },
    handler: async (ctx) => {
        const task = ctx.task as SimpleTask
        const result = new TaskResult(task);
        result.start();
        try {
            await task.run(ctx);
            return result.end();
        } catch(e) {
            return result.end('error', {}, e);
        }
    }
});
```

[MIT License](./LICENSE.md)
