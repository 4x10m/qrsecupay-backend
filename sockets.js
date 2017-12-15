var sockets = {
    sockets: [],
    addClient: function(clientuuid) {
        //check client doesn't exists
        for (var index in this.sockets) {
            if(this.sockets[index].clientuuid && this.sockets[index].clientuuid === clientuuid) {
                return false
            }
        }

        //create client
        this.sockets.push({clientuuid: clientuuid});

        return true;
    },
    add: function(socket, clientuuid) {
        sockets.append({socket: socket, clientuuid: clientuuid});
    },
    setSocket: function(socket, clientuuid) {
        for (index in this.sockets) {
            if(this.sockets[index].clientuuid === clientuuid) {
                this.sockets[index].socket = socket;

                return true;
            }
        }

        return false;
    },
    setUserUUID: function(useruuid, clientuuid) {
        for (index in this.sockets) {
            if(this.sockets[index].clientuuid === clientuuid) {
                this.sockets[index].useruuid = useruuid;

                return true;
            }
        }

        return false;
    },
    searchSocket: function(clientuuid) {
        for (socket in this.sockets) {
            if (this.sockets[socket].clientuuid == clientuuid) {
                return this.sockets[socket].socket;
            }
        }

        return null;
    },
    searchUser: function(clientuuid) {
        for (socket in this.sockets) {
            if (this.sockets[socket].clientuuid == clientuuid) {
                return this.sockets[socket].useruuid;
            }
        }

        return null;
    }
};

module.exports = sockets;