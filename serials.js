var serials = {
    // { serialuuid, clientuuid }
    serials: [],
    add: function(serialuuid, clientuuid) {
        //create client
        this.serials.push({clientuuid: clientuuid, serialuuid: serialuuid});

        return true;
    },
    clientuuid: function(serialuuid) {
        for (socket in this.sockets) {
            if (this.sockets[socket].serialuuid == serialuuid) {
                return this.sockets[socket].clientuuid;
            }
        }

        return null;
    }
};

module.exports = sockets;