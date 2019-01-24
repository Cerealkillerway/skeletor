Meteor.methods({

    // STANDARD SKELEFORM INSERT/UPDATE/DELETE METHODS
    // insert
    skeleCreateDocument: function(data, schemaName) {
        methodData = Skeletor.Utilities.handleMethodRequest(data, schemaName, 'insert');

        Skeletor.Data[methodData.collection].insert(data, function(error, id) {
            if (error) return error;
            return id;
        });
    },
    // update
    skeleUpdateDocument: function(documentId, data, schemaName) {
        methodData = Skeletor.Utilities.handleMethodRequest(data, schemaName, 'update');

        Skeletor.Data[methodData.collection].update({_id: documentId}, {$set: data}, function(error, number) {
            if (error) return error;
            return number;
        });
    },
    // delete
    skeleDeleteDocument: function(documentId, schemaName) {
        methodData = Skeletor.Utilities.handleMethodRequest(data, schemaName, 'delete');

        Skeletor.Data[methodData.collection].remove({_id: documentId}, function(error) {
            if (error) return error;
            return true;
        });
    },


    // USERS
    // create from panel
    skeleCreateUser: function(data, schemaName) {
        Skeletor.Utilities.handleMethodRequest(data, schemaName, 'insert');

        // correctly set profile object on data coming from skeleform (for user creation/update)
        for (let field in data) {
            if (field.indexOf('profile.') === 0) {
                if (!data.profile) data.profile = {};

                data.profile[field.substring(8, field.length)] = data[field];
                delete data[field];
            }

            if (field === 'created') {
                data.profile.created = data[field];
            }

            // handle password sent as object (field with shadowConfirm)
            if (field.indexOf('password') === 0 && _.isObject(data.password)) {
                data.password = data.password.standard;
            }
        }

        data.email = data.userEmail;
        delete data.userEmail;

        return Accounts.createUser(data);

    },
    // update
    skeleUpdateUser: function(documentId, data, schemaName) {
        Skeletor.Utilities.handleMethodRequest(data, schemaName, 'update');

        if (data.userEmail !== undefined) {
            data.emails = [{
                address: data.userEmail,
                verified: false
            }];
            delete data.userEmail;
        }

        if (data.updated) {
            data.profile.updated = data.updated;
        }

        Meteor.users.update({_id: documentId},{$set: data}, function(error, number) {
            if (error) return error;
            return number;
        });
    }

});



//if (Meteor.isServer) Meteor._sleepForMs(5000);
