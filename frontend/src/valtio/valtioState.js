
import { proxy } from "valtio";

const valtioState = proxy({
    game_creator_ipaddress: "123",
    begin_time: "",
    end_time: "",
    players: [],
    chatting: { 1: [], 2: [], 3: [], 4: [] },
    norman_decisions: { 1: [], 2: [], 3: [], 4: [] },
    pete_decisions: { 1: [], 2: [], 3: [], 4: [] },
    erica_messages: { 1: [], 2: [], 3: [], 4: [] }
});

export default valtioState;
