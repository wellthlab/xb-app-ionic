import {
  createSlice,
  createAsyncThunk,
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
  async (moduleId) => {
    const result = await RealmController.enrollToModule(moduleId);
    if (result) {
      return moduleId;
    }
  }
);

export const getResponses = createAsyncThunk(
  "$s22/responses/load",
  async (moduleId) => {
    return RealmController.getResponses(moduleId);
  }
);

export const saveResponse = createAsyncThunk(
  "$s22/responses/save",
  async ({ payload, moduleId, taskIndex, playlistIndex }) => {
    return RealmController.saveResponse(
      payload,
      moduleId,
      playlistIndex,
      taskIndex
    );
  }
);

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

export const selectPlaylists = function (state, moduleId) {
  return selectModuleById(state, moduleId)?.playlists;
};

export const selectModuleIdsByTopic = createSelector(
  selectAllModules,
  (state) => state.$s22.enrollments,
  (items, enrollments) => {
    const modules = Object.values(items);

    if (!modules.length) {
      return;
    }

    const enrolledIds = new Set(enrollments);
    const snacks = [];
    const nonSpecials = [];

    for (const item of modules) {
      if (enrolledIds.has(item.id)) {
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
      ["Enrolled", enrollments],
      ["Snacks", snacks],
      ...Object.entries(modulesByTopic),
    ];
  }
);

const selectResponses = function (state, moduleId) {
  return state.$s22.responses[moduleId];
};

export const selectResponse = function (
  state,
  moduleId,
  playlistIndex,
  taskIndex
) {
  return selectResponses(state, moduleId)?.[playlistIndex]?.[taskIndex];
};

export const selectTaskStatuses = createSelector(
  selectPlaylists,
  selectResponses,
  (state, moduleId) => state.$s22._lockInvalidators[moduleId], // Invalidator
  (playlists, responses) => {
    if (!playlists || !responses) {
      return;
    }

    const result = playlists.map(() => []);

    let earliestCreatedAt = null;
    let locked = false;

    for (let i = 0; i < playlists.length; i++) {
      const statuses = result[i];
      for (let j = 0; j < playlists[i].tasks.length; j++) {
        const task = playlists[i].tasks[j];
        const response = responses[i]?.[j];

        if (response) {
          const createdTs = RealmController.idToTs(response.id);
          if (!earliestCreatedAt || createdTs < earliestCreatedAt) {
            earliestCreatedAt = createdTs;
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
              until: lockedUntil,
            });
            locked = true;
            continue;
          }
        }

        if (task.constraint.type === "TIMESTAMP") {
          if (Date.now() < task.constraint.ts) {
            statuses.push({
              status: "LOCKED",
              until: task.constraint.ts,
            });
            locked = true;
            continue;
          }
        }

        statuses.push({ status: "INCOMPLETE" });
        earliestCreatedAt = null;
        locked = false;
      }
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

            playlists: item.playlists.map((playlist) => ({
              name: playlist.name,
              duration: {
                magnitude: playlist.duration.magnitude,
                unit: playlist.duration.unit,
              },
              tasks: playlist.tasks.map((task) => ({
                id: new Realm.BSON.ObjectId().toString(),
                type: task.type,
                icon: task.icon,
                name: task.name,
                desc: task.desc,
                inputs: task.inputs,
                constraint: task.constraint,
                video: task.video,
              })),
            })),
          };
        }
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

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState: [],

  extraReducers: (builder) => {
    builder
      .addCase(loadModules.fulfilled, (state, action) => {
        for (const item of action.payload) {
          if (item.enrolled) {
            state.push(item.id);
          }
        }
      })
      .addCase(enrollToModule.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }

        state.push(action.payload);
      });
  },
});

export const enrollmentsReducer = enrollmentsSlice.reducer;

const responsesSlice = createSlice({
  name: "responses",
  initialState: {},

  extraReducers: (builder) => {
    const insertResponses = function (state, responses) {
      for (const {
        id,
        moduleId,
        playlistIndex,
        taskIndex,
        payload,
      } of responses) {
        let item = state[moduleId];
        if (!item) {
          item = state[moduleId] = [];
        }

        if (!item[playlistIndex]) {
          item[playlistIndex] = [];
        }

        item[playlistIndex][taskIndex] = {
          id: item[playlistIndex][taskIndex]?.id || id,
          payload,
        };
      }
    };

    builder
      .addCase(loadModules.fulfilled, (state, action) => {
        for (const item of action.payload) {
          if (item.enrolled) {
            state[item.id] = [];
          }

          insertResponses(state, item.responses);
        }
      })
      .addCase(enrollToModule.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }

        state[action.payload] = [];
      })
      .addCase(getResponses.fulfilled, (state, action) =>
        insertResponses(state, action.payload)
      )
      .addCase(saveResponse.fulfilled, (state, action) =>
        insertResponses(state, [action.payload])
      );
  },
});

export const responsesReducer = responsesSlice.reducer;

const lockInvalidatorsSlice = createSlice({
  name: "_lockInvalidators",
  initialState: {},

  reducers: {
    invalidateLocks: (state, action) => {
      state[action.payload]++;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loadModules.fulfilled, (state, action) => {
      for (const item of action.payload) {
        state[item.id] = 0;
      }
    });
  },
});

export const { invalidateLocks } = lockInvalidatorsSlice.actions;
export const lockInvalidatorsReducer = lockInvalidatorsSlice.reducer;
