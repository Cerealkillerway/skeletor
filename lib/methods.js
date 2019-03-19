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

        if (methodData.edit && _.size(methodData.edit) > 1) {
            setter.$push = {
                __edits: methodData.edit
            }
        }

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
                            '__update.date': '20190318-12:50:05'
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
            data['profile.updated'] = data.updated;

            delete data.updated;
        }

        Meteor.users.update({_id: documentId}, {$set: data}, function(error, number) {
            if (error) return error;
            return number;
        });
    }

});



//if (Meteor.isServer) Meteor._sleepForMs(5000);
