"use strict";
document.addEventListener("DOMContentLoaded", function () {
    var newDonationButton = document.getElementById("new-donation");
    var nameInputNode = document.getElementById("donation-name");
    var idInputNode = document.getElementById("donation-id");
    var bitsInputNode = document.getElementById("donation-bits");
    var artInputNode = document.getElementById("donation-art");
    if (newDonationButton == null || nameInputNode == null || bitsInputNode == null) {
        console.error("missing DOM hook");
        return;
    }
    newDonationButton.addEventListener("click", function (element) {
        var id = Number(idInputNode.value);
        var name = nameInputNode.value;
        var amount = Number(bitsInputNode.value);
        var art = Number(artInputNode.value);
        idInputNode.value = String(id + 1);
        localStorage.setItem("donation", JSON.stringify({ id: id, name: name, amount: amount, art: art }));
    });
});
//# sourceMappingURL=index.js.map