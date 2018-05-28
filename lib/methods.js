Meteor.methods({

    // STANDARD SKELEFORM INSERT/UPDATE/DELETE METHODS
    // insert
    skeleCreateDocument: function(data, schemaName) {
        'use strict';
        let schema = Skeletor.Schemas[schemaName];
        let collection = schema.__collection;

        // check permissions
        if (!SkeleUtils.Permissions.checkPermissions(Skeletor.Utilities.getPermissions(collection, 'create'))) {
            throw new Meteor.Error('unauthorized');
        }
        /*else {
            if (Meteor.isServer) {
                console.log('server method: auth ok!');
            }
            if (Meteor.isClient) {
                console.log('client method: auth ok!');
            }
        }*/

        if (!Skeletor.Skeleform.validate.checkData(data, schemaName)) {
            throw new Meteor.Error('invalid');
        }

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
    skeleUpdateDocument: function(documentId, data, schemaName) {
        'use strict';
        let schema = Skeletor.Schemas[schemaName];
        let collection = schema.__collection;

        if (collection === 'Settings' && Meteor.isClient) {
            Skeletor.Registry.configurationChanged.set(true);
        }

        // check permissions
        if (!SkeleUtils.Permissions.checkPermissions(Skeletor.Utilities.getPermissions(collection, 'update', {documentId: documentId, data: data}))) {
            throw new Meteor.Error('unauthorized');
        }
        /*else {
            if (Meteor.isServer) {
                console.log('server method: auth ok!');
            }
            if (Meteor.isClient) {
                console.log('client method: auth ok!');
            }
        }*/

        if (!Skeletor.Skeleform.validate.checkData(data, schemaName, documentId)) {
            throw new Meteor.Error('invalid');
        }

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
    skeleDeleteDocument: function(documentId, schemaName) {
        'use strict';
        let schema = Skeletor.Schemas[schemaName];
        let collection = schema.__collection;

        // check permissions
        if (!SkeleUtils.Permissions.checkPermissions(Skeletor.Utilities.getPermissions(collection, 'delete'))) {
            throw new Meteor.Error('unauthorized');
        }
        /*else {
            if (Meteor.isServer) {
                console.log('server method: auth ok!');
            }
            if (Meteor.isClient) {
                console.log('client method: auth ok!');
            }
        }*/

        Skeletor.Data[collection].remove({_id: documentId}, function(error) {
            if (error) return error;
            return true;
        });
    },

    skeleUpdateMenu: function(documentId, data, schemaName) {
        'use strict';
        // check permissions
        if (!SkeleUtils.Permissions.checkPermissions(Skeletor.Utilities.getPermissions('Menus', 'update'))) {
            throw new Meteor.Error('unauthorized');
        }
        /*else {
            if (Meteor.isServer) {
                console.log('server method: auth ok!');
            }
            if (Meteor.isClient) {
                console.log('client method: auth ok!');
            }
        }*/

        if (!Skeletor.Skeleform.validate.checkData(data, schemaName, documentId)) {
            throw new Meteor.Error('invalid');
        }

        _.each(data.menuItems, function(order, pageId) {
            Skeletor.Data.Pages.update({_id: pageId}, {$set: {menuOrder: order}}, function(error, number) {
                if (error) {
                    return error;
                }
            });
        })

        delete data.menuItems;

        return Meteor.call('skeleUpdateDocument', documentId, data, schemaName);
    },


    // USERS
    // create from panel
    skeleCreateUser: function(data, schemaName) {
        'use strict';
        let schema = Skeletor.Schemas[schemaName];

        // check permissions
        if (!SkeleUtils.Permissions.checkPermissions(Skeletor.Utilities.getPermissions('users', 'create'))) {
            throw new Meteor.Error('unauthorized');
        }
        /*else {
            if (Meteor.isServer) {
                console.log('server method: auth ok!');
            }
            if (Meteor.isClient) {
                console.log('client method: auth ok!');
            }
        }*/

        if (!Skeletor.Skeleform.validate.checkData(data, schemaName)) {
            throw new Meteor.Error('invalid');
        }

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

        data.email = data.userEmail;
        delete data.userEmail;

        return Accounts.createUser(data);

    },
    // update
    skeleUpdateUser: function(documentId, data, schemaName) {
        'use strict';
        var schema = Skeletor.Schemas[schemaName];

        // check permissions
        if (!SkeleUtils.Permissions.checkPermissions(Skeletor.Utilities.getPermissions('users', 'update', {documentId: documentId, data: data}))) {
            throw new Meteor.Error('unauthorized');
        }
        /*else {
            if (Meteor.isServer) {
                console.log('server method: auth ok!');
            }
            if (Meteor.isClient) {
                console.log('client method: auth ok!');
            }
        }*/

        if (!Skeletor.Skeleform.validate.checkData(data, schemaName, documentId)) {
            throw new Meteor.Error('invalid');
        }

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
