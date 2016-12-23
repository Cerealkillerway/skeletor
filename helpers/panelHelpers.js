// outputs the defaultLang
UI.registerHelper('defaultLang', function() {
    return Skeletor.configuration.lang.default;
});

// Users
Template.usersList.helpers({
    data: function() {
        var context = {};

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
            context.item = Skeletor.Data.Users.findOne({username: username});
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

        context.item = Template.instance().data.item;

        return context;
    }
});


// Roles
Template.rolesList.helpers({
    data: function() {
        var context = {};

        context.schemaName = 'Roles_default';
        context.schema = Skeletor.Schemas.Roles_default;

        return context;
    }
});

Template.roleCreate.helpers({
    data: function() {
        var context = {};
        var name = FlowRouter.getParam("name");

        if (name) {
            context.item = Skeletor.Data.Roles.findOne({name: name});
        }

        context.schemaName = 'Roles_default';
        context.schema = Skeletor.Schemas.Roles_default;
        context.undoPath = '/panel/roles';

        return context;
    }
});


// Sections
Template.sectionsList.helpers({
    data: function() {
        var context = {};

        context.schemaName = 'Sections_default';
        context.schema = Skeletor.Schemas.Sections_default;

        return context;
    }
});

Template.sectionCreate.helpers({
    data: function() {
        var context = {};
        var code = FlowRouter.getParam('code');
        var segmentLang = FlowRouter.getQueryParam('sLang');

        if (code) {
            var query = {};

            // coming from skelelist link
            if (Session.get('currentItem')) {
                query._id = Session.get('currentItem');
            }
            // normal mode
            else {
                query[segmentLang + '---code'] = code;
            }

            context.item = Skeletor.Data.Sections.findOne(query);
        }

        context.schemaName = 'Sections_default';
        context.schema = Skeletor.Schemas.Sections_default;

        return context;
    }
});


// Pages
Template.pagesList.helpers({
    data: function() {
        var context = {};

        context.schemaName = 'Pages_default';
        context.schema = Skeletor.Schemas.Pages_default;

        return context;
    }
});

Template.pageCreate.helpers({
    data: function() {
        var context = {};
        var code = FlowRouter.getParam('code');
        var segmentLang = FlowRouter.getQueryParam('sLang');

        if (code) {
            var query = {};

            // coming from skelelist link
            if (Session.get('currentItem')) {
                query._id = Session.get('currentItem');
            }
            // normal mode
            else {
                query[segmentLang + '---code'] = code;
            }

            context.item = Skeletor.Data.Pages.findOne(query);
        }

        context.schemaName = 'Pages_default';
        context.schema = Skeletor.Schemas.Pages_default;

        return context;
    }
});

// Menus
Template.menusList.helpers({
    data: function() {
        var context = {};

        context.schemaName = 'Menus_default';
        context.schema = Skeletor.Schemas.Menus_default;

        return context;
    }
});

Template.menuCreate.helpers({
    data: function() {
        var context = {};
        var code = FlowRouter.getParam('code');
        var segmentLang = FlowRouter.getQueryParam('sLang');

        if (code) {
            var query = {};

            // coming from skelelist link
            if (Session.get('currentItem')) {
                query._id = Session.get('currentItem');
            }
            // normal mode
            else {
                query[segmentLang + '---code'] = code;
            }

            context.item = Skeletor.Data.Menus.findOne(query);
        }

        context.schemaName = 'Menus_default';
        context.schema = Skeletor.Schemas.Menus_default;

        return context;
    }
});
