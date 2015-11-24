// Users
Template.usersList.helpers({
    data: function() {
        var context = {};

        context.list = Skeletor.Data.Users.find({}, {sort: {username: 1}});
        context.schemaName = 'Users_default';
        context.schema = Skeletor.Schemas.Users_default;

        return context;
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
        var username = FlowRouter.getParam("username");
        var context = {
            schemaName: 'Users_changePassword',
            schema: Skeletor.Schemas.Users_changePassword
        };

        context.item = Meteor.users.findOne({username: username});

        return context;
    }
});


// Pages
Template.pagesList.helpers({
    data: function() {
        var context = {};

        context.list = Skeletor.Data.Pages.find({}, {sort: {code: 1}});
        context.schemaName = 'Pages_default';
        context.schema = Skeletor.Schemas.Pages_default;

        return context;
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
