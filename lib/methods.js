// correctly set profile object on data coming from skeleform (for user creation/update)
function setProfile(data) {
    for (var field in data) {
        if (field.indexOf('profile.') === 0) {
            if (!data.profile) data.profile = {};

            data.profile[field.substring(8, field.length)] = data[field];
            delete data[field];
        }
    }
};

Meteor.methods({
    
    // STANDARD SKELEFORM INSERT/UPDATE/DELETE METHODS
    // insert
    insertDocument: function(data, schemaName) {
        var schema = Skeletor.Schemas[schemaName];
        var collection = schema.__collection;
        if (!checkPermissions(getPermissionType(collection, 'insert'), Meteor.userId())) throw new Meteor.Error("unauthorized");
        //if (!skeleformValidateDataObject(data, schemaName)) throw new Meteor.Error("invalid");
        
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
        var schema = Schemas[schemaName];
        if (!checkPermissions(getPermissionType('users', 'insert'), Meteor.userId())) throw new Meteor.Error("unauthorized");
        //if (!skeleformValidateDataObject(data, schemaName)) throw new Meteor.Error("invalid");
        
        setProfile(data);
        data.email = data.userEmail;
        delete data.userEmail;

        return Accounts.createUser(data);
        
    },
    // update
    updateUser: function(documentId, data, schemaName, changed) {
        var schema = Schemas[schemaName];
        if (!checkPermissions(getPermissionType('users', 'update'), Meteor.userId())) throw new Meteor.Error("unauthorized");
        //if (!skeleformValidateDataObject(data, schemaName, documentId)) throw new Meteor.Error("invalid");

        setProfile(data);
        //manage update for fields which accept also partial updates
        /*for (var field in data.profile) {
            var fieldSchema = schema[field];
            var currentChanged = changed[field];

            if (currentChanged) {
                switch (fieldSchema.output) {
                    case 'imageUpload':
                        //if only title has been sent, update only title subfield
                        if (currentChanged.length === 1 && currentChanged[0] === 'title') {
                            var set = {};
                                set[field + '.title'] = data[field].title;

                            Meteor.users.update({_id: documentId}, {$set: set});
                            delete data[field];    //remove current field from data object (that will be setted in a single update)
                        }
                        break;

                    default:
                        break;
                }
            }
        }*/
        
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
