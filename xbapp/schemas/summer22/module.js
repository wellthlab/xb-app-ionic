const Joi = require("joi");
const {
  BSON: { ObjectID },
} = require("realm-web");

module.exports = Joi.object({
  _id: Joi.object().instance(ObjectID).required(),
  experimentId: Joi.string().required(),

  name: Joi.string().required(),
  topic: Joi.string().required(),
  desc: Joi.string().required(),
  difficulty: Joi.string().required(),
  colour: Joi.string().required(),

  playlists: Joi.array()
    .items({
      name: Joi.string().required(),
      minutes: Joi.number().required(),
      tasks: Joi.array()
        .items({
          verb: Joi.valid("LEARN", "MOVE", "WATCH", "").required(),
          type: Joi.valid("INSTRUCTIONS", "VIDEO", "EDT", "OTHER").required(),
          name: Joi.string().required(),
          desc: Joi.string().required(),
          timed: Joi.boolean(),
          video: Joi.string().when("type", {
            not: "VIDEO",
            then: Joi.forbidden(),
            otherwise: Joi.required(),
          }),
          edtMoves: Joi.array().items(Joi.string()),
          duration: Joi.number().integer().when("edtMoves", {
            not: Joi.exist(),
            then: Joi.forbidden(),
            otherwise: Joi.required(),
          }),
        })
        .required(),
    })
    .required(),
});
