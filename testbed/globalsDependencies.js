window.recalcHp = function (damageAmount, newHp, maxHp) {
};
window.flip = function (side) {
    document.getElementById('side').innerText = side;
};
window.updateBitBoss = function (bossData) {
};
window.receiveQueue = function (data) {
};
window.receiveCharList = function (data) {
    console.log('receive char list', data);
};
window.bossTextOut = function (color, text) {
    console.log('boss text out: ', color, text);
};
window.bossMessageTooManyChanges = function () {
    console.log('boss message changed too many times');
};
window.winner = function (name) {
    console.log('new winner: ', name);
};