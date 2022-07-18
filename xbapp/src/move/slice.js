import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";

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

export const updateResponse = createAsyncThunk(
  "$s22/enrollments/respond",
  async ({ payload, enrollmentId, playlistId, taskId }) => {
    await RealmController.updateResponse(
      payload,
      enrollmentId,
      playlistId,
      taskId
    );

    return { enrollmentId, playlistId, taskId, payload };
  }
);

// Selectors

export const selectAllModules = function (state) {
  return state.$s22.modules.items;
};

export const selectModulesStatus = function (state) {
  return state.$s22.modules.status;
};

export const selectModuleById = function (state, id) {
  return selectAllModules(state)[id];
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

const selectAllEnrollments = function (state) {
  return state.$s22.enrollments;
};

export const selectEnrollmentsForModule = createSelector(
  (state, moduleId) => {
    const xbModule = selectModuleById(state, moduleId);
    return xbModule ? xbModule.enrollments : [];
  },
  selectAllEnrollments,
  (moduleEnrollments, enrollments) => {
    return moduleEnrollments.map((enrollmentId) => enrollments[enrollmentId]);
  }
);

const selectModulePlaylists = function (state, moduleId) {
  const xbModule = selectModuleById(state, moduleId);
  if (xbModule) {
    return xbModule.playlists;
  }
};

const selectEnrollmentResponses = function (state, enrollmentId) {
  const enrollment = selectAllEnrollments(state)[enrollmentId];
  if (enrollment) {
    return enrollment.responses;
  }
};

export const selectCurrentPlaylistId = createSelector(
  selectModulePlaylists,
  (state, _0, enrollmentId) => selectEnrollmentResponses(state, enrollmentId),
  (playlists, allResponses) => {
    if (!playlists || !allResponses) {
      return;
    }

    let currentPlaylistId = -1;
    for (let i = 0; i < allResponses.length; i++) {
      let broken = false;
      for (const response of allResponses[i]) {
        if (!response || !response.completedAt) {
          broken = true;
          break;
        }
      }

      if (!broken) {
        currentPlaylistId = i;
      }
    }

    return currentPlaylistId === playlists.length - 1
      ? currentPlaylistId
      : currentPlaylistId + 1;
  }
);

export const selectTaskStatuses = createSelector(
  (state, moduleId, playlistId) => {
    const playlists = selectModulePlaylists(state, moduleId);
    if (playlists) {
      return playlists[playlistId];
    }
  },
  (state, _0, playlistId, enrollmentId) => {
    const responses = selectEnrollmentResponses(state, enrollmentId);
    if (responses) {
      return responses[playlistId] || [];
    }
  },
  (playlist, responses) => {
    console.log(responses);
    if (!playlist || !responses) {
      return;
    }

    const statuses = [];
    let lastCompletedTimestamp = null;
    let locked = false;

    for (let i = 0; i < playlist.tasks.length; i++) {
      const task = playlist.tasks[i];
      const correspondingResponse = responses[i];

      if (correspondingResponse) {
        if (correspondingResponse.completedAt) {
          statuses.push({ status: "COMPLETED" });

          if (
            !lastCompletedTimestamp ||
            correspondingResponse.completedAt > lastCompletedTimestamp
          ) {
            lastCompletedTimestamp = correspondingResponse.completedAt;
          }

          continue;
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
        if (!lastCompletedTimestamp) {
          statuses.push({ status: "LOCKED" });
          locked = true;
          continue;
        }

        if (Date.now() - lastCompletedTimestamp < task.constraint.ms) {
          statuses.push({
            status: "LOCKED",
            until: lastCompletedTimestamp + task.constraint.ms,
          });
          locked = true;
          continue;
        }
      }

      if (
        task.constraint.type === "TIMESTAMP" &&
        Date.now() < task.constraint.ts
      ) {
        statuses.push({
          status: "LOCKED",
          until: task.constraint.ts,
        });

        locked = true;
        continue;
      }

      statuses.push({ status: "INCOMPLETE" });
    }

    return statuses;
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
            enrollments: item.enrollments.map((enrollment) => enrollment.id),

            playlists: item.playlists.map((playlist) => ({
              name: playlist.name,
              duration: {
                magnitude: playlist.duration.magnitude,
                unit: playlist.duration.unit,
              },
              tasks: playlist.tasks.map((task) => ({
                type: task.type,
                icon: task.icon,
                name: task.name,
                desc: task.desc,
                inputs: task.inputs,
                constraint: task.constraint,
              })),
            })),
          };
        }
      })
      .addCase(enrollToModule.fulfilled, (state, action) => {
        if (state.status !== "fulfilled" || !action.payload) {
          return;
        }

        state.items[action.payload.moduleId].enrollments.push(
          action.payload.id
        );
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
  initialState: {},

  extraReducers: (builder) => {
    builder
      .addCase(enrollToModule.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }

        state[action.payload.id] = {
          id: action.payload.id,
          responses: action.payload.responses.map((playlistResponses) =>
            playlistResponses.map((response) => ({
              type: response.type,
            }))
          ),
        };
      })
      .addCase(loadModules.fulfilled, (state, action) => {
        for (const item of action.payload) {
          for (const enrollment of item.enrollments) {
            state[enrollment.id] = {
              id: enrollment.id,
              responses: enrollment.responses.map((playlistResponses) =>
                playlistResponses
                  ? playlistResponses.map((response) => ({
                      type: response.type,
                    }))
                  : null
              ),
            };
          }
        }
      })
      .addCase(updateResponse.fulfilled, (state, action) => {
        const responsesForEnrollment =
          state[action.payload.enrollmentId].responses;
        const playlistId = action.payload.playlistId;
        let responses = responsesForEnrollment[playlistId];
        if (!responses) {
          responses = responsesForEnrollment[playlistId] = [];
        }

        responses[action.payload.taskId] = action.payload.payload;
      });
  },
});

export const enrollmentsReducer = enrollmentsSlice.reducer;
