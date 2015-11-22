// Server side only methods

Meteor.methods({
    updateUserPassword: function(userId, password) {
        console.log(userId);
        console.log(password);
        Accounts.setPassword(userId, password, {logout: false});
    }
});