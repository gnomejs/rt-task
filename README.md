# @rt/message-bus

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

A simple message bus used for swapping out formatting for messages
in cli applications.  This module exists primarily for the rt ("run-task")
cli.

## Basic Usage

```typescript
import { Message, DefaultMessageBus } from str from '@rt/message-bus'

const bus = new DefaultMessageBus();

export class WriteMessage extends Message {
    constructor(public message: string) {
        super("write")
    }
}

const messages: Message[] = [];
bus.addListener((message) => {
    messages.push(message);
});

bus.send(new WriteMessage("test"));

console.log(messages.length);
console.log(messages[0].kind);
console.log((messages[0] as WriteMessage).message);

```

[MIT License](./LICENSE.md)
