// Pages
Template.pagesList.helpers({
    data: function() {
        return Skeletor.Data.Pages.find();
    }
});

Template.pageCreate.helpers({
    data: function() {
        var context = {};
        var code = FlowRouter.getParam("code");

        if (code) {
            context.item = Skeletor.Data.Pages__detail__.findOne({code: code});
        }
        
        context.schemaName = 'Pages_default';
        context.schema = Skeletor.Schemas.Pages_default;
        context.undoPath = '/panel/pages';

        return context;
    }
});

// Users
Template.usersList.helpers({
    data: function() {
        return Meteor.users.find();
    }
});

Template.userCreate.helpers({
    data: function() {
        var context = {};
        var username = FlowRouter.getParam("username");

        if (username) {
            context.item = Meteor.users.findOne({username: username});
            if (context.item) {
                context.item.userEmail = context.item.emails[0].address;
            }
        }

        context.schemaName = 'Users_default';
        context.schema = Skeletor.Schemas.Users_default;
        context.method = {
            insert: 'insertUser',
            update: 'updateUser'
        };

        return context;
    }
});

Template.userChangePassword.helpers({
    data: function() {
        var context = {
            schemaName: 'Users_changePassword',
            schema: Skeletor.Schemas.Users_changePassword
        };

        return context;
    }
});