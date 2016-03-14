// Server side only methods

Meteor.methods({
    updateUserPassword: function(userId, password) {
        Accounts.setPassword(userId, password, {logout: false});
    }
});
