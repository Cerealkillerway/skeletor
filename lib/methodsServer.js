// Server side only methods

Meteor.methods({
    updateUserPassword: function(userId, password) {
        // check permissions
        if (!SkeleUtils.Permissions.checkPermissions(Skeletor.Utilities.getPermissions('users', 'update'))) {
            throw new Meteor.Error('unauthorized');
        }

        Accounts.setPassword(userId, password, {logout: false});
    }
});
