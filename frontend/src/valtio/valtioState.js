
import { proxy } from "valtio";

const valtioState = proxy({
    ipAddress_creator: "a",
    game_begin: "",
    game_end: "",
    players: [],
    chatting: { 1: [], 2: [], 3: [], 4: [] },
    norman_decisions: { 1: [], 2: [], 3: [], 4: [] },
    pete_decisions: { 1: [], 2: [], 3: [], 4: [] },
    erica_messages: { 1: [], 2: [], 3: [], 4: [] }
});

export default valtioState;
