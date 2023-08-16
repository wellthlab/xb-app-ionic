enum Emotion {
    Ecstacy = "#fade1f",
    Joy = "#fae54d",
    Serenity = "#fcf089",
    Optimism = "#fdbd5a",
    Vigilance = "#ec7a31",
    Anticipation = "#f19857",
    Interest = "#f8b985",
    Aggressiveness = "#f18060",
    Rage = "#da4541",
    Anger = "#e76f6a",
    Annoyance = "#f09c96",
    Contempt = "#bb6e95",
    Loathing = "#72518e",
    Disgust = "#8e6fa0",
    Boredom = "#b9a3c5",
    Remorse = "#7e7eb0",
    Grief = "#5569a6",
    Sadness = "#6e8fc0",
    Pensiveness = "#9db5da",
    Disappointment = "#6eaace",
    Amazement = "#55b2d9",
    Surprise = "#6ec4e0",
    Distraction = "#a0d3e5",
    Awe = "#66baa4",
    Terror = "#39a349",
    Fear = "#6db779",
    Apprehension = "#9ccb99",
    Submission = "#90c069",
    Admiration = "#a2c737",
    Trust = "#b6d166",
    Accpetance = "#d1df95",
    Love = "#dce15c",
}

export default Emotion

export const getKeyFromValue = function (e: Emotion) {
    return Object.keys(Emotion)[Object.values(Emotion).indexOf(e)]
}
