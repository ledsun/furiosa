# What's this?
Show a list of actions in applications that is made using
[action-stream](https://github.com/ledsun/action-stream).

## Install

```
npm install -g furiosa
```

## Usage
### 1. Specify a drectory
#### Example

```
furiosa ~/graph-editor/lib/
```

### 2. Specify changed files
#### Example

```
git diff --name-only 0ec0bd0707d885c0a2f22ae3b267bd9d817814a5 ba9d708d1d856c99ce3c26a629b4ef2505b54493 lib | furiosa
```

### Output sample

```json
{
    "filename": "stream/renderStream/nodeEditorStream/ModeRenderStream.js",
    "actions": [
        {
            "target": "target.EDITOR",
            "handlers2": [
                {
                    "type": "actionType.SELECT",
                    "handler2": "--- ArrowFunction --->"
                },
                {
                    "type": "actionType.UNSELECT",
                    "handler2": "--- ArrowFunction --->"
                }
            ]
        }
    ]
}
```

## Other guides
- Do not show actions that spcify by a function call.
  - That is a too big streem. Split!
