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
            context.item = Skeletor.Data.Pages__detail__.find({code: code});
        }
        
        context.schemaName = 'Pages_default';
        context.schema = Schemas.Pages_default;
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
            context.item = Meteor.users.find({username: username});
        }
        
        context.schemaName = 'Users_default';
        context.schema = Schemas.Users_default;
        context.undoPath = '/panel/users';
        context.method = {
            insert: 'insertUser',
            update: 'updateUser'
        };

        return context;
    }
});