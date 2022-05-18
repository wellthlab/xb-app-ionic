
import Moves from "../../moves.json";
const moves = Moves.moves;

// Get an object for a move from the moves.json file
function getMove(id) {
    for (const i in moves) {
        let m = moves[i];
        if (m.id === id) {
            return m;
        }
    }

    return false;
}

// Get a default move for different move types
function defaultMoveForType(type) {
    switch (type) {
        // Bilateral
        case "bilateral lower push":
            return "fullsquat";
        case "bilateral lower pull":
            return "wallrdlprep";
        case "bilateral upper push":
            return "flatpushup";
        case "bilateral upper pull":
            return "chinup";
        // Unilateral
        case "unilateral lower push":
            return "vsit";
        case "unilateral lower pull":
            return "lsit";
        case "unilateral upper push":
            return "sideplank";
        case "unilateral upper pull":
            return "onearmpull";
        // Isometric
        // case "isolateral lower push":
        //   return "vsit";
        // case "isolateral lower pull":
        //   return "lsit";
        // case "isolateral upper push":
        //   return "sideplank";
        // case "isolateral upper pull":
        //   return "onearmpull";
        default:
            return "fullsquat";
    }
}

function getDefaultMoves(task) {
    const blockArray = [];
    for (const eachBlockIndex in task.moveTypes) {
        const eachBlock = task.moveTypes[eachBlockIndex];
        const movesPicked = {};
        for (const eachMoveIndex in eachBlock) {
            const eachMove = eachBlock[eachMoveIndex];
            movesPicked[eachMove.replaceAll(" ", "+")] = getMove(
                defaultMoveForType(eachMove)
            );
        }
        blockArray.push(movesPicked);
    }

    return blockArray;
}

// When there are no exercises, then fill with default "Select a Move"
// messages
function createEmptyMovementsChosen(task) {
    const blockArray = [];
    for (const eachBlockIndex in task.moveTypes) {
        const eachBlock = task.moveTypes[eachBlockIndex];
        const movesPicked = {};
        for (const eachMoveIndex in eachBlock) {
            const eachMove = eachBlock[eachMoveIndex].split(" ").join("+");
            movesPicked[eachMove] = { name: "Select a Move" };
        }
        blockArray.push(movesPicked);
    }

    return blockArray;
}

// check the movesForPlaylist object has the correct moves in it
function checkMovesCorrect(task, movesForPlaylist) {
    for (const eachBlockIndex in task.moveTypes) {
        const eachBlock = task.moveTypes[eachBlockIndex];
        for (const move in eachBlock) {
            if (!movesForPlaylist[eachBlockIndex].hasOwnProperty(move)) {
                return createEmptyMovementsChosen(task);
            }
        }
    }

    return movesForPlaylist;
}

// Check if the user has set their exercises. If not, display a button to
// pick moves
function checkIfAllExercisesChosen(task, exercisesChosen, setExercisesChosen) {
    if (!exercisesChosen) {
        return false;
    }

    // If the number of blocks has increased during the week, then just reset
    // to empty moves picked
    if (exercisesChosen.length !== task.moveTypes.length) {
        setExercisesChosen(createEmptyMovementsChosen());
    }

    let numChosen = 0;
    const numRequired = task.moveTypes.length * 2;

    for (const block of exercisesChosen) {
        for (const exercise of Object.values(block)) {
            // TODO: in this loop we should check if the exercise type is valid
            if (exercise.name !== "Select a Move") {
                numChosen += 1;
            }
        }
    }

    return numChosen === numRequired; // are all the exercises chosen?;
}

export {getMove, defaultMoveForType, getDefaultMoves, checkMovesCorrect, createEmptyMovementsChosen, checkIfAllExercisesChosen};
