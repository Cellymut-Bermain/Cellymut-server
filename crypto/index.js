const crypto = require("crypto");
let secretKey = "38un098y4c390uj30r9e324d3r3209413847j10x871j0"
exports.createRandomId = function() {
    return crypto.randomBytes(10).toString('hex');
};

exports.createRandomSalt = function() {
    return crypto.randomBytes(15).toString('hex');
};

exports.createPassword = function(plainText, salt) {
    return crypto.createHmac('sha256', salt)
        .update(plainText)
        .digest('hex') + "." + salt;
};

exports.createKey = (phoneNumber) => {
    return crypto.createHmac("sha256", secretKey)
        .update(phoneNumber)
        .digest("hex");
};
