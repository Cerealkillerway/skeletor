import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


BlazeLayout.setRoot('body');

// settings
Template.settingCreate.helpers({
    data: function() {
        const instance = Template.instance();
        let context = {};
        let segmentLang = FlowRouter.getQueryParam('sLang');
        let query = {};

        query.code = 'publicAppConf';

        context.item = Skeletor.Data.Settings.findOne(query);

        context.schemaName = 'Settings_default';
        context.schema = Skeletor.Schemas.Settings_default;
        context.skeleSubsReady = instance.skeleSubsReady;

        return context;
    }
});


// application data
Template.applicationDataCreate.helpers({
    data: function() {
        const instance = Template.instance();
        let context = {};
        let segmentLang = FlowRouter.getQueryParam('sLang');
        let query = {};

        query.code = 'applicationData';

        context.item = Skeletor.Data.Settings.findOne(query);

        context.schemaName = 'applicationData_default';
        context.schema = Skeletor.Schemas.applicationData_default;
        context.skeleSubsReady = instance.skeleSubsReady;

        return context;
    }
});


// Users
Template.usersList.helpers({
    data: function() {
        const instance = Template.instance();
        let context = {};

        context.schemaName = 'Users_default';
        context.schema = Skeletor.Schemas.Users_default;
        context.skeleSubsReady = instance.skeleSubsReady;

        return context;
    }
});

Template.userCreate.helpers({
    data: function() {
        const instance = Template.instance();
        let context = {};
        let username = FlowRouter.getParam('username');

        if (username && instance.skeleSubsReady.get()) {
            context.item = Skeletor.Data.Users.findOne({username: username});
            context.item.userEmail = context.item.emails[0].address;
        }

        context.schemaName = 'Users_default';
        context.schema = Skeletor.Schemas.Users_default;
        context.skeleSubsReady = instance.skeleSubsReady;

        return context;
    }
});


// Roles
Template.rolesList.helpers({
    data: function() {
        const instance = Template.instance();
        let context = {};

        context.schemaName = 'Roles_default';
        context.schema = Skeletor.Schemas.Roles_default;
        context.skeleSubsReady = instance.skeleSubsReady;

        return context;
    }
});

Template.roleCreate.helpers({
    data: function() {
        const instance = Template.instance();
        let context = {};
        let name = FlowRouter.getParam('name');

        if (name) {
            context.item = Skeletor.Data.Roles.findOne({name: name});
        }

        context.schemaName = 'Roles_default';
        context.schema = Skeletor.Schemas.Roles_default;
        context.skeleSubsReady = instance.skeleSubsReady;

        return context;
    }
});


// Sections
Template.sectionsList.helpers({
    data: function() {
        const instance = Template.instance();
        let context = {};

        context.schemaName = 'Sections_default';
        context.schema = Skeletor.Schemas.Sections_default;
        context.skeleSubsReady = instance.skeleSubsReady;

        return context;
    }
});

Template.sectionCreate.helpers({
    data: function() {
        const instance = Template.instance();
        let context = {};
        let code = FlowRouter.getParam('code');
        let segmentLang = FlowRouter.getQueryParam('sLang');

        if (code) {
            let query = {};

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
        context.skeleSubsReady = instance.skeleSubsReady;

        return context;
    }
});


// Pages
Template.pagesList.helpers({
    data: function() {
        const instance = Template.instance();
        let context = {};

        context.schemaName = 'Pages_default';
        context.schema = Skeletor.Schemas.Pages_default;
        context.skeleSubsReady = instance.skeleSubsReady;

        return context;
    }
});

Template.pageCreate.helpers({
    data: function() {
        const instance = Template.instance();
        let context = {};
        let code = FlowRouter.getParam('code');
        let segmentLang = FlowRouter.getQueryParam('sLang');

        if (code) {
            let query = {};

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
        context.skeleSubsReady = instance.skeleSubsReady;

        return context;
    }
});


// Menus
Template.menusList.helpers({
    data: function() {
        const instance = Template.instance();
        let context = {};

        context.schemaName = 'Menus_default';
        context.schema = Skeletor.Schemas.Menus_default;
        context.skeleSubsReady = instance.skeleSubsReady;

        return context;
    }
});

Template.menuCreate.helpers({
    data: function() {
        const instance = Template.instance();
        let context = {};
        let name = FlowRouter.getParam('name');
        let currentLang = FlowRouter.getParam('itemLang');
        let segmentLang = FlowRouter.getQueryParam('sLang');

        if (name) {
            let query = {};

            // coming from skelelist link
            if (Session.get('currentItem')) {
                query._id = Session.get('currentItem');
            }
            // normal mode
            else {
                query.name = name;
            }

            context.item = Skeletor.Data.Menus.findOne(query);

            if (context.item) {
                // find menu items
                let pagesQuery = {};
                let pagesOptions = {
                    fields: {
                        menuOrder: 1
                    },
                    sort: {
                        menuOrder: 1
                    }
                };

                pagesQuery.menu = context.item._id;
                pagesQuery[currentLang + '---published'] = true;
                pagesOptions.fields[currentLang + '---code'] = 1;
                pagesOptions.fields[currentLang + '---menuName'] = 1;
                pagesOptions.fields[currentLang + '---menuIcon'] = 1;

                context.menuItems = Skeletor.Data.Pages.find(pagesQuery, pagesOptions);
            }
        }

        context.schemaName = 'Menus_default';
        context.schema = Skeletor.Schemas.Menus_default;
        context.skeleSubsReady = instance.skeleSubsReady;

        return context;
    }
});
