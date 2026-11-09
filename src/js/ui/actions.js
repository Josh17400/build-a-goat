// ---------- what the buttons do: run the rule, then redraw ----------
// The rules (career/, economy/, creator/, save/ ...) change the game and never draw. Each handler here is
// the name a button calls, and the name a saved run's action log replays, so these names are part of the
// save format: never rename one. A handler runs its rule and redraws only when the rule did something.
function chooseSchool(i){enroll(i);render();}
function declare(){enterDraft();render();}
function startNBA(){turnPro();UI().spMsg=null;render();scrollTo(0,0);}
function returnSchool(){stayInSchool();render();}
function toggleDaily(){flipDaily();render();}
function buyPerk(k,d){if(setPerk(k,d))render();}
function setDiff(d){if(chooseDiff(d))render();}
function buyGear(k){if(upgradeGear(k))render();}
function spinEra(){if(rollEra())render();}
function applyArch(i){fillArch(i);render();}
function randomBuild(){fillRandom();render();}
function resumeRun(){const ok=loadRun();render();if(ok)scrollTo(0,0);return ok;}
function quitRun(){leaveRun();render();scrollTo(0,0);}
