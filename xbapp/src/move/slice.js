import {
  createSlice,
  createAsyncThunk,
  createAction,
  createSelector,
} from "@reduxjs/toolkit";

import * as Realm from "realm-web";
import * as RealmController from "../controllers/realm";

// Actions

export const loadModules = createAsyncThunk("$s22/modules/load", async () => {
  return RealmController.getModules();
});

export const enrollToModule = createAsyncThunk(
  "$s22/modules/enroll",
  (moduleId) => {
    return RealmController.enrollToModule(moduleId);
  }
);

export const saveResponse = createAsyncThunk(
  "$s22/enrollments/respond",
  async ({ payload, enrollmentIndex, taskIndex, moduleId }, { getState }) => {
    const state = getState();
    const enrollmentId = selectEnrollmentIdFromIndex(
      state,
      moduleId,
      enrollmentIndex
    );

    const response = await RealmController.saveResponse(
      payload,
      enrollmentId,
      taskIndex
    );

    return { enrollmentIndex, moduleId, taskIndex, response };
  }
);

export const triggerLockRecomputation = createAction("$s22/modules/recompute");

// Selectors

export const selectAllModules = function (state) {
  return state.$s22.modules.items;
};

export const selectModulesStatus = function (state) {
  return state.$s22.modules.status;
};

export const selectModuleById = function (state, moduleId) {
  return selectAllModules(state)[moduleId];
};

export const selectEnrollments = function (state, moduleId) {
  return selectAllModules(state)[moduleId]?.enrollments;
};

export const selectEnrollmentIdFromIndex = function (
  state,
  moduleId,
  enrollmentIndex
) {
  return selectEnrollments(state, moduleId)?.[enrollmentIndex]?.id;
};

export const selectResponse = function (
  state,
  moduleId,
  enrollmentIndex,
  taskIndex
) {
  return selectEnrollments(state, moduleId)?.[enrollmentIndex]?.responses[
    taskIndex
  ];
};

export const selectModuleIdsByTopic = createSelector(
  selectAllModules,
  (items) => {
    const modules = Object.values(items);

    if (!modules.length) {
      return;
    }

    // Special categories

    const enrolled = [];
    const snacks = [];
    const nonSpecials = [];

    for (const item of modules) {
      if (item.enrollments.length) {
        enrolled.push(item.id);
        continue;
      }

      if (item.playlists.length === 1) {
        snacks.push(item.id);
        continue;
      }

      nonSpecials.push(item.id);
    }

    const modulesByTopic = {};
    for (const id of nonSpecials) {
      const topic = items[id].topic;
      let modulesForTopic = modulesByTopic[topic];
      if (!modulesForTopic) {
        modulesForTopic = modulesByTopic[topic] = [];
      }

      modulesForTopic.push(id);
    }

    return [
      ["Enrolled", enrolled],
      ["Snacks", snacks],
      ...Object.entries(modulesByTopic),
    ];
  }
);

export const selectPlaylists = createSelector(
  (state, moduleId) => selectModuleById(state, moduleId)?.tasks,
  (state, moduleId) => selectModuleById(state, moduleId)?.playlists,
  (state, moduleId, enrollmentIndex) =>
    selectEnrollments(state, moduleId)[enrollmentIndex]?.responses,
  (state, moduleId) => selectModuleById(state, moduleId)?._trigger,
  (tasks, playlists, responses) => {
    if (!tasks || !playlists || !responses) {
      return;
    }

    const statuses = [];

    let earliestCreatedAt = null;
    let locked = false;

    for (let i = 0; i < tasks.length; i++) {
      const response = responses[i];
      const task = tasks[i];

      if (response) {
        if (!earliestCreatedAt || response.createdAt < earliestCreatedAt) {
          earliestCreatedAt = response.createdAt;
        }

        if (!response.payload) {
          statuses.push({ status: "COMPLETED" });
          continue;
        }

        if (task.type === "SELF_ASSESSMENT" && response.payload.checked) {
          statuses.push({ status: "COMPLETED" });
          continue;
        }

        if (task.type === "INPUT") {
          const nonOptionalInputCount = task.inputs.filter(
            (input) => !input.optional
          ).length;

          const nonFalsyInputValueCount = Object.values(
            response.payload
          ).filter((input) => !!input).length;

          if (nonFalsyInputValueCount === nonOptionalInputCount) {
            statuses.push({ status: "COMPLETED" });
            continue;
          }
        }

        statuses.push({ status: "EDITING" });
        continue;
      }

      if (locked) {
        statuses.push({ status: "LOCKED" });
        continue;
      }

      if (!task.constraint) {
        statuses.push({ status: "INCOMPLETE" });
        continue;
      }

      if (task.constraint.type === "DELAY") {
        if (!earliestCreatedAt) {
          statuses.push({ status: "LOCKED" });
          locked = true;
          continue;
        }

        const lockedUntil = earliestCreatedAt + task.constraint.ms;

        if (Date.now() < lockedUntil) {
          statuses.push({
            status: "LOCKED",
            remainingTime: lockedUntil - Date.now(),
          });
          locked = true;
          continue;
        }
      }

      if (task.constraint.type === "TIMESTAMP") {
        if (Date.now() < task.constraint.ts) {
          statuses.push({
            status: "LOCKED",
            remainingTime: task.constraint.ts - Date.now(),
          });
          locked = true;
          continue;
        }
      }

      statuses.push({ status: "INCOMPLETE" });
      earliestCreatedAt = null;
      locked = false;
    }

    const result = [];
    for (const playlist of playlists) {
      result.push({
        ...playlist,
        tasks: playlist.tasks.map((index) => ({
          ...tasks[index],
          ...statuses[index],
        })),
      });
    }

    return result;
  }
);

// Slice

const modulesSlice = createSlice({
  name: "modules",
  initialState: { items: {}, status: "idle", error: null },

  extraReducers: (builder) => {
    builder
      .addCase(loadModules.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.error = null;

        for (const item of action.payload) {
          state.items[item.id] = {
            id: item.id,
            name: item.name,
            topic: item.topic,
            colour: item.colour,
            desc: item.desc,
            difficulty: item.difficulty,
            enrollments: item.enrollments.map((enrollment) => ({
              id: enrollment.id,
              responses: enrollment.responses.map((response) => ({
                payload: response.payload,
                createdAt: response.createdAt,
                completed: response.completed,
              })),
            })),

            playlists: item.playlists.map((playlist) => ({
              name: playlist.name,
              duration: {
                magnitude: playlist.duration.magnitude,
                unit: playlist.duration.unit,
              },
              tasks: playlist.tasks,
            })),

            tasks: item.tasks.map((task) => ({
              id: new Realm.BSON.ObjectId(
                Realm.BSON.ObjectId.generate()
              ).toString(),
              type: task.type,
              icon: task.icon,
              name: task.name,
              desc: task.desc,
              inputs: task.inputs,
              constraint: task.constraint,
            })),

            _trigger: 0,
          };
        }
      })
      .addCase(enrollToModule.fulfilled, (state, action) => {
        if (state.status !== "fulfilled" || !action.payload) {
          return;
        }

        state.items[action.payload.moduleId].enrollments.push({
          id: action.payload.id,
          responses: action.payload.responses.map((response) => ({
            payload: response.payload,
            createdAt: response.createdAt,
            completed: response.completed,
          })),
        });
      })
      .addCase(saveResponse.fulfilled, (state, action) => {
        if (state.status !== "fulfilled") {
          return;
        }

        const {
          moduleId,
          enrollmentIndex,
          taskIndex,
          response,
        } = action.payload;

        state.items[moduleId].enrollments[enrollmentIndex].responses[
          taskIndex
        ] = response;
      })
      .addCase(triggerLockRecomputation, (state, action) => {
        if (state.status !== "fulfilled") {
          return;
        }

        state.items[action.payload]._trigger++;
      })
      .addCase(loadModules.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(loadModules.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error;
      });
  },
});

export const modulesReducer = modulesSlice.reducer;
