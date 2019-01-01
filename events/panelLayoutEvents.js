import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Sortable from 'sortablejs';


// Panel layout
Template.skelePanelLayout.onCreated(function() {
    Skeletor.appRendered = new ReactiveVar(false);
});

Template.skelePanelLayout.onRendered(function() {
    // if defined, call custom callback
    if (Skeletor.customCallbacks.skelePanelLayout.onRendered) {
        Skeletor.customCallbacks.skelePanelLayout.onRendered();
    }

    SkeleUtils.GlobalUtilities.skeleSetPanelBackground();

    // used by skeleform to understand when all templates are rendered (ex. to init staticbar)
    Skeletor.appRendered.set(true);
});

Template.skelePanelLayout.events({
    'click #logout': function(event) {
        SkeleUtils.Accounts.logout();
    },
    'click .backTop': function(event) {
        SkeleUtils.GlobalUtilities.scrollTo(0, Skeletor.configuration.animations.scrollTop);
    }
});


// Panel main menu
Template.panelMainMenu.onRendered(function() {
    this.$('.button-collapse').sideNav({
        closeOnClick: true,
        edge: 'right'
    });

    SkeleUtils.GlobalUtilities.skeleSwingMenu(this.$('.iconSwing'));
});


// Panel nude layout
Template.skelePanelNudeLayout.onCreated(function() {
    Skeletor.appRendered = new ReactiveVar(false);
});
Template.skelePanelNudeLayout.onRendered(function() {
    SkeleUtils.GlobalUtilities.skeleSetPanelBackground();
    Skeletor.appRendered.set(true);
});


// unauthorized
Template.skeleUnauthorized.events({
    'click #backToLogin': function() {
        FlowRouter.go(Skeletor.configuration.login.defaultLoginPath, {}, {lang: FlowRouter.current().queryParams.lang});
    }
});


// Login
Template.skeleLogin.onRendered(function() {
    this.$('#email').focus();
});
Template.skeleLogin.events({
    'keypress': function(event, instance) {
        let email = instance.$('#email').val();
        let password = instance.$('#password').val();

        if (event.charCode === 13) {
            SkeleUtils.Accounts.loginWithPassword(email, password);
        }
    },
    'click #login': function(event, instance) {
        let email = instance.$('#email').val();
        let password = instance.$('#password').val();

        SkeleUtils.Accounts.loginWithPassword(email, password);
    }
});


// Dashboard
Template.skelePanelDashboard.onRendered(function() {
    SkeleUtils.GlobalEvents.TooltipOnRendered(this);
});
Template.skelePanelDashboard.onDestroyed(function() {
    SkeleUtils.GlobalEvents.TooltipOnDestroyed(this);
});


// Settings
Template.settingCreate.onCreated(function() {
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let settingsQuery = {};

    this.autorun(() => {
        settingsQuery.code = 'publicAppConf';
        let currentSetting = Meteor.subscribe('findDocuments', 'Settings', settingsQuery, {});

        // set reactive var for all subscriptions ready
        this.skeleSubsReady.set(currentSetting.ready());
    });
});


// Application data
Template.applicationDataCreate.onCreated(function() {
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let settingsQuery = {};

    this.autorun(() => {
        settingsQuery.code = 'applicationData';
        let currentSetting = Meteor.subscribe('findDocuments', 'Settings', settingsQuery, {});

        // set reactive var for all subscriptions ready
        this.skeleSubsReady.set(currentSetting.ready());
    });
});


// Users
Template.usersList.onCreated(function() {
    Skeletor.Utilities.autoSubscribe(this, 'Users_default', 'list');
});

Template.userCreate.onCreated(function() {
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let userQuery = {};
    let usersOptions = {};
    let rolesOptions = {};

    /*usersOptions.fields = {
        username: 1
    };*/
    rolesOptions.fields = {
        name: 1
    };

    this.autorun(() => {
        let username = FlowRouter.getParam('username');

        // needed for both update and creation
        //let usersList = Skeletor.subsManagers.usersSubs.subscribe('findDocuments', 'Users', {}, usersOptions);
        let rolesList = Skeletor.subsManagers.rolesSubs.subscribe('findDocuments', 'Roles', {}, rolesOptions);

        // case updating record
        if (username) {
            userQuery.username = username;

            let currentUser = Meteor.subscribe('findDocuments', 'Users', userQuery, {});

            // set reactive var for all subscriptions ready
            this.skeleSubsReady.set(
                //Skeletor.subsManagers.usersSubs.ready() &&
                Skeletor.subsManagers.rolesSubs.ready() &&
                currentUser.ready()
            );
        }
        else {
            // set reactive var for all subscriptions ready
            this.skeleSubsReady.set(
                //Skeletor.subsManagers.usersSubs.ready() &&
                Skeletor.subsManagers.rolesSubs.ready()
            );
        }
    });
});


// Roles
Template.rolesList.onCreated(function() {
    Skeletor.Utilities.autoSubscribe(this, 'Roles_default', 'list');
});

Template.roleCreate.onCreated(function() {
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let roleQuery = {};
    let rolesOptions = {};

    rolesOptions.fields = {
        name: 1
    };

    this.autorun(() => {
        let name = FlowRouter.getParam('name');

        // needed for both update and creation
        let rolesList = Skeletor.subsManagers.rolesSubs.subscribe('findDocuments', 'Roles', {}, rolesOptions);

        // case updating record
        if (name) {
            roleQuery.name = name;

            let currentRole = Meteor.subscribe('findDocuments', 'Roles', roleQuery, {});

            // set reactive var for all subscriptions ready
            this.skeleSubsReady.set(
                Skeletor.subsManagers.rolesSubs.ready() &&
                currentRole.ready()
            );
        }
        else {
            // set reactive var for all subscriptions ready
            this.skeleSubsReady.set(Skeletor.subsManagers.rolesSubs.ready());
        }
    });
});


// Sections
Template.sectionsList.onCreated(function() {
    Skeletor.Utilities.autoSubscribe(this, 'Sections_default', 'list');
});

Template.sectionCreate.onCreated(function() {
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let sectionQuery = {};
    let sectionsOptions = {};

    sectionsOptions.fields = {};

    this.autorun(() => {
        let currentLang = FlowRouter.getParam('itemLang');
        let segmentLang = FlowRouter.getQueryParam('sLang');
        let code = FlowRouter.getParam('code');

        // needed for both update and creation
        sectionsOptions.fields[currentLang + '---code'] = 1;

        let sectionsList = Skeletor.subsManagers.sectionsSubs.subscribe('findDocuments', 'Sections', {}, sectionsOptions);

        // case updating record
        if (code) {
            sectionQuery[segmentLang + '---code'] = code;

            let currentSection = Meteor.subscribe('findDocuments', 'Sections', sectionQuery, {});

            // set reactive var for all subscriptions ready
            this.skeleSubsReady.set(
                Skeletor.subsManagers.sectionsSubs.ready() &&
                currentSection.ready()
            );
        }
        else {
            // set reactive var for all subscriptions ready
            this.skeleSubsReady.set(Skeletor.subsManagers.sectionsSubs.ready());
        }
    });
});


// Pages
Template.pagesList.onCreated(function() {
    Skeletor.Utilities.autoSubscribe(this, 'Pages_default', 'list');
});

Template.pageCreate.onCreated(function() {
    Skeletor.Utilities.autoSubscribe(this, 'Pages_default', 'detail');
});


// Menus
Template.menusList.onCreated(function() {
    Skeletor.Utilities.autoSubscribe(this, 'Menus_default', 'list');
});

Template.menuCreate.onCreated(function() {
    Skeletor.Utilities.autoSubscribe(this, 'Menus_default', 'detail');
});

Template.menuItemsSortable.onCreated(function() {
    console.log(this);
});

Template.menuItemsSortable.onRendered(function() {
    let items = this.$('.menuItems')[0];
    let sortableOptions = {
        animation: 150,
        handle: '.dragHandle',
    }


    let sortable = Sortable.create(items, sortableOptions);
});



Template.skeleTooltip.onRendered(function() {
    SkeleUtils.GlobalEvents.TooltipOnRendered(this);
});
Template.skeleTooltip.onDestroyed(function() {
    SkeleUtils.GlobalEvents.TooltipOnDestroyed(this);
});
