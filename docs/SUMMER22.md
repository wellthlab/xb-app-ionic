# Summer 22

In this experiment, we introduced the concepts of "experiment" to users of the application. "Experiment"s are based on "module"s from previous iterations of the application, with minor restructuring to the data schema to allow for the development of task constraints and admin content management tools. We also worked on different input types for tasks, and are planning to add more as the experiment progresses.

**Note:** For the purpose of this documentation, experiment and "experiment" (within quotes) refer to different meanings. Whenever the term is quoted, it should refer to a new concept of "module", whereas its unquoted counterpart refers to the actual XB experiment, carried out by the University staff.

In addition to the above changes, we also introduced massively refactored Redux state structure and React components.

## Table of contents

- [Terminologies](#terminologies)
  - [Task](#task)
  - [Playlist](#playlist)
  - [Task constraints](#task-constraints)
  - [Task status](#task-status)
  - [Module](#module)
  - [Snack/Snack module](#snacksnack-module)
  - ["Experiment"](#"experiment")
- [MongoDB databases](#mongodb-databases)
- [Data schemas](#data-schemas)
  - [`IModule`](#imodule)
  - [`IResponse`](#iresponse)
  - [`IEnrollment`](#ienrollment)
- [UI displays](#ui-displays)
  - [Icons](#icons)
  - [Inputs](#inputs)
- [App Store compliance](#app-store-compliance)
  - [Account deletion](#account-deletion)

## Terminologies

Before starting making changes to the current codebase, it is important to understand a few terminologies and how they might relate to each other.

### Task

A set of instructions, questions and/or measurements that require users' responses. For example, the task "Measuring your heartrate" might include some instructions on how to do so, and an input that allows users to input their measurements.

### Playlist

A collection of tasks. By default, there is no specific order in which tasks need to be completed. To enforce an order, see [task constraints](#task-constraints) defined below.

### Task constraints

A set of constraints that need to be met before a task can be viewed. At the moment, a task can only have a single constraint of the below types, however, future iterations might allow multiple unique constraints. Constraint types are:

- `TIMESTAMP`: Requires a specific point in time to be reached before a task can be viewed. For example, we want to require users to measure their heartbeats on the very first day of the relaunch, which is the 25th of July 2022.

- `DELAY`: Requires a minimum amount of time to elapse before a task can be viewed. For example, we want users to try a new exercise 2 hours after measuring their heartbeats. The delay calculation starts as soon as a user view a task that is not locked.

### Task status

For each user, a task can be within any of the following statuses:

- `INCOMPLETE`: The user has not viewed the task yet.
- `EDITING`: The user has viewed, and/or filled in some inputs for that task.
- `LOCKED`: If any constraint (defined above) fails to be met, a task is locked until further actions are taken. For time-based constraints, a countdown timer can be shown for better user experience.
- `COMPLETED`: The user has viewed, and completed all input fields (if any) for the task.

### Module

A collection of playlists.

### Snack/Snack module

A module with a single playlist.

### "Experiment"

A loose definition for modules that have a specific order in which tasks need to be completed, that is, have at least a constraint set.

## MongoDB databases

Whilst most collections remain under V2 for backward compatibility and gradual refactoring, new databases have been introduced to accommodate future experiments, whilst keeping shared data across all of them. This new structure allows for greater flexibility when developing the XB application, as research software requires fast changes by nature.

- `SHARED`: A database that holds collections that should be used across different experiments. For example, `teams` and `profiles`. This database is currently not in use.

- `SUMMER22`: A database that holds collections that are required for the functionality of the Summer 22 experiment. Collections are:

  - `modules`: Holds documents that represent modules.
  - `enrollments`: Holds documents that represent the link between a user and the module they chose to enrolled in.
  - `responses`: Holds documents that represent a user response to a single task within any module.

Please refer below for the schema for each of the above collections.

## Data schemas

### `IModule`

```ts
interface IModule {
  _id: ObjectId;
  name: string;
  desc?: string;
  topic: string;
  difficulty?: string;
  colour?: string;
  playlists: IPlaylist[];
}

interface IPlaylist {
  name: string;
  duration: { magnitude: number; unit: string };
  tasks: (ISelfAssessmentTask | IInputTask | IInstructionalTask)[];
}

// Task types

interface ISelfAssessmentTask extends IGenericTask {
  type: "SELF_ASSESSMENT";
}

interface IInstructionalTask extends IGenericTask {
  type: "INSTRUCTIONS";
}

interface IInputTask extends IGenericTask {
  type: "INPUT";
  inputs: (
    | ITextInput
    | INumberInput
    | ISelectInput
    | ISliderInput
    | IHeartrateInput
  )[];
}

interface IGenericTask {
  name: string;
  desc?: string;
  icon: "ADVICE" | "QUESTIONNAIRE" | "MEASURE" | "EXPERIMENT" | "CAMERA";
  video?: string;
  constraint?: IDelayConstraint | ITimestampConstraint;
}

// Constraint types

interface IDelayConstraint {
  type: "DELAY";
  ms: number;
}

interface ITimestampConstraint {
  type: "TIMESTAMP";
  ts: number;
}

// Input types

interface ITextInput extends IGenericInput {
  type: "text";
}

interface INumberInput extends IGenericInput {
  type: "number";
}

interface ISelectInput extends IGenericInput {
  type: "select";
  options: string[];
}

interface ISliderInput extends IGenericInput {
  type: "slider";
  step?: number;
  range: [number, number];
}

interface IHeartrateInput extends IGenericInput {
  type: "heartrate";
}

interface IGenericInput {
  optional?: boolean;
  label: string;
}
```

where:

- `_id`: The ObjectId of the module.
- `name`: The name of the module.
- `desc`: The description of the module. Optional.
- `topic`: The topic of the module. Used to categorise modules.
- `difficulty`: The difficulty of the module. Optional.
- `colour`: The display colour of the module. Optional.
- `playlists`: An array of playlists where:
  - `name`: The name of the playlist.
  - `duration`: An object that represents how long the playlist should take where:
    - `magnitude`: The magnitude of time.
    - `unit`: The unit of time.
  - `tasks`: An array of tasks where each task can be a self assessment task, an input task or an instructional task.

All task types extend the following keys:

- `name`: The name of the task.
- `desc`: The description of the task. Optional.
- `icon`: The icon for the task. Please refer to [icons](#icons) for their displays.
- `video`: The Youtube ID for the video to display in the task page. Optional.
- `constraint`: The constraint that needs to be satisfied to unlock this task where:
  - `type`: The constraint type. Can be `DELAY` or `TIMESTAMP`.
  - `ms`: This key is present as an argument to the `DELAY` constraint type, otherwise it is forbidden. The amount of time that needs to elapse before the task can be unlocked.
  - `ts`: This key is present as an argument to the `TIMESTAMPT` constraint type, otherwise it is forbidden. The specific timestamp in which the task can be unlocked.

Self assessment task schema has the extra keys:

- `type`: Must be `SELF_ASSESSMENT`.

Instructional task schema has the extra keys:

- `type`: Must be `INSTRUCTIONS`.

Input task schema has the extra keys:

- `type`: Must be `INPUT`.
- `inputs`: An array of inputs to be displayed for this task. Please refer to [inputs](#inputs) for their displays. All inputs have the following base keys:
  - `optional`: Whether this input field can be saved as empty. Optional.
  - `label`: The label for this input.

Text input schema has the extra keys:

- `type`: Must be `text`.

Number input schema has the extra keys:

- `type`: Must be `number`.

Heartrate input schema has the extra keys:

- `type`: Must be `heartrate`.

Select input schema has the extra keys:

- `type`: Must be `select`.
- `options`: An array of strings representing available options.

Slider input schema has the extra keys:

- `type`: Must be `slider`.
- `step`: Slider step. Optional.
- `range`: A tuple where the first item is the minimum slider value, and the second item is the maximum slider value.

### `IResponse`

```ts
interface IResponse {
  _id: ObjectId;
  userId: string;
  moduleId: string;
  playlistIndex: number;
  taskIndex: number;
  payload?: { checked: boolean } | Record<string, string | number | null>;
}
```

where:

- `_id`: The ObjectId of the response.
- `userId`: The user ID of the user who saved this response.
- `moduleId`: The module ID of the module which this response corresponds to.
- `playlistIndex`: The playlist index that points to the playlist within the module which this response corresponds to.
- `taskIndex`: The task index that points to the task within the playlist which this response corresponds to.
- `payload`: The payload of the response. If the task is instructional, this field is `null`. If the task is self assessment, there is a single boolean field `checked` that denotes whether the user has seen/read the provided description. If the task is input, it is an object whose each key is an input label and each corresponding value is the provided value from the user.

### `IEnrollment`

```ts
interface IEnrollment {
  _id: ObjectId;
  userId: string;
  moduleId: string;
}
```

where:

- `_id`: The ObjectId of the enrollment.
- `userId`: The user ID of the user who created this enrollment record.
- `moduleId`: The module ID of the module which the user enrolled.

## UI displays

The following section documents how the application displays certain properties in the user interface.

### Icons

TODO: Screenshots

### Inputs

TODO: Screenshots

## App Store compliance

The following section documents features required by App Store in order for the application to be published.

### Account deletion

App Store requires applications to allow users to fully erase their data. This functionality is located in the Settings page at the bottom. Upon clicking "Delete personal information", the following happens:

- The user is informed that the action is irreversible.
- Upon their confirmation to proceed, the application will log the user out.
- The application will then delete associated profiles, team membership and responses.
- Finally, the application will send a notification email to Richard Gomer, who will notify other relevant staff members to erase the data.
