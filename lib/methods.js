import { Accounts } from 'meteor/accounts-base';


function handleTimeMachineData(methodData, setter) {
    if (methodData.edit && _.size(methodData.edit) > 1) {
        setter.$push = {
            __edits: methodData.edit
        }
    }
}


Meteor.methods({
    // STANDARD SKELEFORM INSERT/UPDATE/DELETE METHODS
    // insert
    skeleCreateDocument: function(data, schemaName) {
        methodData = Skeletor.Utilities.handleMethodRequest(data, schemaName, 'insert');

        Skeletor.Data[methodData.collection].insert(methodData.data, function(error, id) {
            if (error) throw error;
        });

        return methodData;
    },


    // update
    skeleUpdateDocument: function(documentId, data, schemaName, item) {
        methodData = Skeletor.Utilities.handleMethodRequest(data, schemaName, 'update', item);

        let setter = {
            $set: methodData.data
        };

        handleTimeMachineData(methodData, setter);

        Skeletor.Data[methodData.collection].update({_id: documentId}, setter, function(error, number) {
            if (error) throw error;
        });

        return methodData;
    },


    // delete
    skeleDeleteDocument: function(documentId, schemaName) {
        methodData = Skeletor.Utilities.handleMethodRequest(null, schemaName, 'delete');

        Skeletor.Data[methodData.collection].remove({_id: documentId}, function(error) {
            if (error) throw error;
        });
    },


    // partial or total time machine states reset
    skeleTimeMachineReset: function(documentId, schemaName, stateTime) {
        methodData = Skeletor.Utilities.handleMethodRequest({}, schemaName, 'update');
        let query = {
            _id: documentId
        };

        if (stateTime === 'all') {
            Skeletor.Data[methodData.collection].update(query,
                {
                    $unset: {
                        '__edits': ''
                    }
                },
                function(error, number) {
                    if (error) throw error;
                }
            );
        }
        else {
            Skeletor.Data[methodData.collection].update(query,
                {
                    $pull: {
                        '__edits': {
                            '__update.date': stateTime
                        }
                    }
                },
                function(error, number) {
                    if (error) throw error;
                }
            );
        }
    },


    // USERS
    // create from panel
    skeleCreateUser: function(data, schemaName) {
        methodData = Skeletor.Utilities.handleMethodRequest(data, schemaName, 'insert');

        // correctly set profile object on data coming from skeleform (for user creation/update)
        for (let field in data) {
            if (field.indexOf('profile.') === 0) {
                if (!data.profile) data.profile = {};

                data.profile[field.substring(8, field.length)] = data[field];
                delete data[field];
            }

            // handle password sent as object (field with shadowConfirm)
            if (field.indexOf('password') === 0 && _.isObject(data.password)) {
                data.password = data.password.standard;
            }
        }

        let emails = data.emails;

        delete data.emails;
        data.email = emails[0].address;

        let userId = Accounts.createUser(data);

        if (Meteor.isServer) {
            for (let index = 1; index < emails.length; index++) {
                Accounts.addEmail(userId, emails[index].address);
            }
        }

        return methodData;

    },
    // update
    skeleUpdateUser: function(documentId, data, schemaName, item) {
        methodData = Skeletor.Utilities.handleMethodRequest(data, schemaName, 'update', item);

        let setter = {
            $set: methodData.data
        };

        handleTimeMachineData(methodData, setter);

        Meteor.users.update({_id: documentId}, setter, function(error, number) {
            if (error) throw error;
        });

        return methodData;
    }

});



//if (Meteor.isServer) Meteor._sleepForMs(5000);
