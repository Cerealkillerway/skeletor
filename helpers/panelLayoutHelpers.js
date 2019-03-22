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
