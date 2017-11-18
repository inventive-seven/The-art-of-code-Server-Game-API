const mysql = require("mysql2/promise");
const config = require("../config.json");

const state = {
    db: null
};

const connect = (opts, done) => {
    if (state.db) {
        return done();
    }

    mysql.createConnection(opts)
        .then(connection => {
            state.db = connection;
            done();
        })
        .catch(err => done(err));
}

const disconnect = () => {
    state.db.end();
}

const get = () => {
    return state.db;
}

const moveHero = (heroId, newPosition) => {
    let db = get();

    db.execute(
        `
            update heroes 
            set positionX=${newPosition.x}, positionY=${newPosition.y}
            where id = ${heroId};
        `
    ).catch(console.log)
}

const moveObject = (objectId, newPosition) => {
    let db = get();

    db.execute(
        `
            update objects 
            set positionX=${newPosition.x}, positionY=${newPosition.y}
            where id = ${objectId};
        `
    ).catch(console.log)
}

const move = (object, newPosition) => {
    let db = get();
    
}

const SqlString = (s) => {
    if (s)
        s = s.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\" + char;
            }
        });
    return (s === null ? "NULL" : `'${s}'`);
}

const SqlNum = (n) => (n === null || isNaN(n) ? "NULL" : `${n}`);

const SqlBool = (b) => {
    switch (b) {
        case true:
            return "TRUE";

        case false:
            return "FALSE";

        case null:
            return "NULL";
    }
};

module.exports = {
    connect: connect,
    disconnect: disconnect,
    get: get,
};