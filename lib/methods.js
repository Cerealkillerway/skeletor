Meteor.methods({

    // STANDARD SKELEFORM INSERT/UPDATE/DELETE METHODS
    // insert
    insertDocument: function(data, schemaName) {
        var schema = Skeletor.Schemas[schemaName];
        var collection = schema.__collection;

        if (!checkPermissions(getPermissionType(collection, 'insert'), Meteor.userId())) throw new Meteor.Error("unauthorized");
        //if (!skeleformValidateDataObject(data, schemaName)) throw new Meteor.Error("invalid");

        // security check to disallow forced "created" data
        if (data.created) {
            delete data.created;
        }
        if (schema.__options.tracked) {
            data.created = {
                user: Meteor.userId(),
                date: moment().format('MMMM Do YYYY, h:mm:ss a')
            };
        }

        Skeletor.Data[collection].insert(data, function(error, id) {
            if (error) return error;
            return id;
        });
    },
    // update
    updateDocument: function(documentId, data, schemaName) {
        var schema = Skeletor.Schemas[schemaName];
        var collection = schema.__collection;

        if (!checkPermissions(getPermissionType(collection, 'update'), Meteor.userId())) throw new Meteor.Error("unauthorized");
        //if (!skeleformValidateDataObject(data, schemaName, documentId)) throw new Meteor.Error("invalid");

        // security check to disallow forced "updated" data
        if (data.updated) {
            delete data.updated;
        }
        if (schema.__options.tracked) {
            data.updated = {
                user: Meteor.userId(),
                date: moment().format('MMMM Do YYYY, h:mm:ss a')
            };
        }

        Skeletor.Data[collection].update({_id: documentId}, {$set: data}, function(error, number) {
            if (error) return error;
            return number;
        });
    },
    // delete
    deleteDocument: function(documentId, schemaName) {
        var schema = Skeletor.Schemas[schemaName];
        var collection = schema.__collection;

        if (!checkPermissions("adminOperations", Meteor.userId())) throw new Meteor.Error("unauthorized");

        Skeletor.Data[collection].remove({_id: documentId}, function(error) {
            if (error) return error;
        });
    },


    // USERS
    // create from panel
    insertUser: function(data, schemaName) {
        var schema = Skeletor.Schemas[schemaName];

        if (!checkPermissions(getPermissionType('users', 'insert'), Meteor.userId())) throw new Meteor.Error("unauthorized");
        //if (!skeleformValidateDataObject(data, schemaName)) throw new Meteor.Error("invalid");

        // correctly set profile object on data coming from skeleform (for user creation/update)
        for (var field in data) {
            if (field.indexOf('profile.') === 0) {
                if (!data.profile) data.profile = {};

                data.profile[field.substring(8, field.length)] = data[field];
                delete data[field];
            }
        }

        data.email = data.userEmail;
        delete data.userEmail;

        return Accounts.createUser(data);

    },
    // update
    updateUser: function(documentId, data, schemaName, changed) {
        var schema = Skeletor.Schemas[schemaName];

        if (!checkPermissions(getPermissionType('users', 'update'), Meteor.userId())) throw new Meteor.Error("unauthorized");
        //if (!skeleformValidateDataObject(data, schemaName, documentId)) throw new Meteor.Error("invalid");

        if (data.userEmail !== undefined) {
            data.emails = [{
                address: data.userEmail,
                verified: false
            }];
            delete data.userEmail;
        }

        Meteor.users.update({_id: documentId},{$set: data}, function(error, number) {
            if (error) return error;
            return number;
        });
    }

});



//if (Meteor.isServer) Meteor._sleepForMs(5000);
