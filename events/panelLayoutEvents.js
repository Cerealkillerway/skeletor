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
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let userOptions = {};
    let rolesOptions = {};

    userOptions.fields = {
        username: 1,
        profile: 1
    };
    rolesOptions.fields = {
        name: 1
    };

    this.loadMore = [];
    this.loadMore.push({
        subscriptionHandler: 'usersSubs',
        subscriptionName: 'findDocuments',
        collection: 'Users',
        query: {},
        options: userOptions,
        schemaName: 'Users_default'
    });

    this.autorun(() => {
        let usersList = Skeletor.subsManagers.usersSubs.subscribe('findDocuments', 'Users', {}, userOptions);
        let rolesList = Skeletor.subsManagers.rolesSubs.subscribe('findDocuments', 'Roles', {}, rolesOptions);

        // set reactive var for all subscriptions ready
        this.skeleSubsReady.set(
            Skeletor.subsManagers.usersSubs.ready() &&
            Skeletor.subsManagers.rolesSubs.ready()
        );
    });
});

Template.userCreate.onCreated(function() {
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let userQuery = {};
    let usersOptions = {};
    let rolesOptions = {};

    usersOptions.fields = {
        username: 1
    };
    rolesOptions.fields = {
        name: 1
    };

    this.autorun(() => {
        let username = FlowRouter.getParam('username');

        // needed for both update and creation
        let usersList = Skeletor.subsManagers.usersSubs.subscribe('findDocuments', 'Users', {}, usersOptions);
        let rolesList = Skeletor.subsManagers.rolesSubs.subscribe('findDocuments', 'Roles', {}, rolesOptions);

        // case updating record
        if (username) {
            userQuery.username = username;

            let currentUser = Meteor.subscribe('findDocuments', 'Users', userQuery, {});

            // set reactive var for all subscriptions ready
            this.skeleSubsReady.set(
                Skeletor.subsManagers.usersSubs.ready() &&
                Skeletor.subsManagers.rolesSubs.ready() &&
                currentUser.ready()
            );
        }
        else {
            // set reactive var for all subscriptions ready
            this.skeleSubsReady.set(
                Skeletor.subsManagers.usersSubs.ready() &&
                Skeletor.subsManagers.rolesSubs.ready()
            );
        }
    });
});


// Roles
Template.rolesList.onCreated(function() {
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let rolesOptions = {};

    rolesOptions.fields = {
        name: 1
    };

    this.loadMore = [];
    this.loadMore.push({
        subscriptionHandler: 'rolesSubs',
        subscriptionName: 'findDocuments',
        collection: 'Roles',
        query: {},
        options: rolesOptions,
        schemaName: 'Roles_default'
    });

    this.autorun(() => {
        let rolesList = Skeletor.subsManagers.rolesSubs.subscribe('findDocuments', 'Roles', {}, rolesOptions);

        // set reactive var for all subscriptions ready
        this.skeleSubsReady.set(Skeletor.subsManagers.rolesSubs.ready());
    });
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
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let defaultLang = Skeletor.configuration.lang.default;
    let sectionsOptions = {};

    sectionsOptions.fields = {};
    this.loadMore = [];
    this.loadMore.push({
        subscriptionHandler: 'sectionsSubs',
        subscriptionName: 'findDocuments',
        collection: 'Sections',
        query: {},
        options: sectionsOptions,
        schemaName: 'Sections_default'
    });

    this.autorun(() => {
        let currentLang = FlowRouter.getParam('itemLang');

        sectionsOptions.fields[currentLang + '---code'] = 1;
        sectionsOptions.fields[currentLang + '---name'] = 1;

        if (currentLang !== defaultLang) {
            sectionsOptions.fields[defaultLang + '---code'] = 1;
            sectionsOptions.fields[defaultLang + '---name'] = 1;
        }

        let sectionsList = Skeletor.subsManagers.sectionsSubs.subscribe('findDocuments', 'Sections', {}, sectionsOptions);

        // set reactive var for all subscriptions ready
        this.skeleSubsReady.set(Skeletor.subsManagers.sectionsSubs.ready());
    });
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
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let defaultLang = Skeletor.configuration.lang.default;
    let pagesOptions = {
        fields: {
            section: 1,
            menu: 1,
            placeholderItem: 1
        }
    };
    let sectionOptions = {
        fields: {}
    };
    let menuOptions = {
        fields: {}
    };
    this.loadMore = [];
    this.loadMore.push({
        subscriptionHandler: 'pagesSubs',
        subscriptionName: 'findDocuments',
        collection: 'Pages',
        query: {},
        options: pagesOptions,
        schemaName: 'Pages_default'
    });

    sectionOptions.fields = {};

    this.autorun(() => {
        let currentLang = FlowRouter.getParam('itemLang');

        pagesOptions.fields[currentLang + '---title'] = 1;
        pagesOptions.fields[currentLang + '---code'] = 1;
        pagesOptions.fields[currentLang + '---published'] = 1;

        sectionOptions.fields[currentLang + '---code'] = 1;
        sectionOptions.fields[currentLang + '---name'] = 1;

        menuOptions.fields.name = 1;

        if (currentLang !== defaultLang) {
            pagesOptions.fields[defaultLang + '---title'] = 1;
            pagesOptions.fields[defaultLang + '---code'] = 1;
            pagesOptions.fields[defaultLang + '---published'] = 1;

            sectionOptions.fields[defaultLang + '---code'] = 1;
            sectionOptions.fields[defaultLang + '---name'] = 1;
        }


        let pagesList = Skeletor.subsManagers.pagesSubs.subscribe('findDocuments', 'Pages', {}, pagesOptions);
        let sectionCodes = Skeletor.subsManagers.sectionsSubs.subscribe('findDocuments', 'Sections', {}, sectionOptions);
        let menuCodes = Skeletor.subsManagers.menusSubs.subscribe('findDocuments', 'Menus', {}, menuOptions);

        // set reactive var for all subscriptions ready
        this.skeleSubsReady.set(
            Skeletor.subsManagers.pagesSubs.ready() &&
            Skeletor.subsManagers.sectionsSubs.ready() &&
            Skeletor.subsManagers.menusSubs.ready()
        );
    });
});

Template.pageCreate.onCreated(function() {
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let pageQuery = {};
    let pageOptions = {
        fields: {}
    };
    let sectionOptions = {
        fields: {}
    };
    let menuOptions = {
        fields: {}
    };

    this.autorun(() => {
        let currentLang = FlowRouter.getParam('itemLang');
        let segmentLang = FlowRouter.getQueryParam('sLang');
        let defaultLang = Skeletor.configuration.lang.default;
        let code = FlowRouter.getParam('code');

        // needed for both update and creation
        let pageCodes = Skeletor.subsManagers.pagesSubs.subscribe('findDocuments', 'Pages', {}, pageOptions);

        pageOptions.fields[currentLang + '---code'] = 1;
        pageOptions.fields[currentLang + '---published'] = 1;

        sectionOptions.fields[currentLang + '---code'] = 1;
        sectionOptions.fields[currentLang + '---name'] = 1;

        menuOptions.fields.name = 1;

        if (defaultLang !== currentLang) {
            sectionOptions.fields[defaultLang + '---code'] = 1;
            sectionOptions.fields[defaultLang + '---name'] = 1;
        }

        let sectionCodes = Skeletor.subsManagers.sectionsSubs.subscribe('findDocuments', 'Sections', {}, sectionOptions);
        let menuCodes = Skeletor.subsManagers.menusSubs.subscribe('findDocuments', 'Menus', {}, menuOptions);

        // case updating record
        if (code) {
            pageQuery[segmentLang + '---code'] = code;

            let currentPage = Meteor.subscribe('findDocuments', 'Pages', pageQuery, {});
            let pageCodes = Skeletor.subsManagers.pagesSubs.subscribe('findDocuments', 'Pages', {}, pageOptions);
            let sectionCodes = Skeletor.subsManagers.sectionsSubs.subscribe('findDocuments', 'Sections', {}, sectionOptions);
            let menuCodes = Skeletor.subsManagers.menusSubs.subscribe('findDocuments', 'Menus', {}, menuOptions);

            // set reactive var for all subscriptions ready
            this.skeleSubsReady.set(
                Skeletor.subsManagers.pagesSubs.ready() &&
                Skeletor.subsManagers.sectionsSubs.ready() &&
                Skeletor.subsManagers.menusSubs.ready() &&
                currentPage.ready()
            );
        }
        else {
            // set reactive var for all subscriptions ready
            this.skeleSubsReady.set(
                Skeletor.subsManagers.pagesSubs.ready() &&
                Skeletor.subsManagers.sectionsSubs.ready() &&
                Skeletor.subsManagers.menusSubs.ready()
            );
        }
    });
});


// Menus
Template.menusList.onCreated(function() {
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let defaultLang = Skeletor.configuration.lang.default;
    let menusOptions = {};

    menusOptions.fields = {};
    this.loadMore = [];
    this.loadMore.push({
        subscriptionHandler: 'menusSubs',
        subscriptionName: 'findDocuments',
        collection: 'Menus',
        query: {},
        options: menusOptions,
        schemaName: 'Menus_default'
    });

    this.autorun(() => {
        let currentLang = FlowRouter.getParam('itemLang');

        menusOptions.fields.name = 1;

        if (currentLang !== defaultLang) {
            menusOptions.fields.name = 1;
        }

        let menusList = Skeletor.subsManagers.menusSubs.subscribe('findDocuments', 'Menus', {}, menusOptions);

        // set reactive var for all subscriptions ready
        this.skeleSubsReady.set(Skeletor.subsManagers.menusSubs.ready());
    });
});

Template.menuCreate.onCreated(function() {
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let menuQuery = {};
    let menusOptions = {};

    menusOptions.fields = {};

    this.autorun(() => {
        let currentLang = FlowRouter.getParam('itemLang');
        let segmentLang = FlowRouter.getQueryParam('sLang');
        let name = FlowRouter.getParam('name');

        // needed for both update and creation
        menusOptions.fields.name = 1;

        let menusList = Skeletor.subsManagers.menusSubs.subscribe('findDocuments', 'Menus', {}, menusOptions);

        // case updating record
        if (name) {
            menuQuery.name = name;

            let currentMenu = Skeletor.subsManagers.menusSubs.subscribe('findDocuments', 'Menus', menuQuery, {});
            let menuItems = Skeletor.persistentSubsManagers.menusSubs.subscribe('findMenuItems', name, currentLang);

            // set reactive var for all subscriptions ready
            this.skeleSubsReady.set(
                Skeletor.subsManagers.menusSubs.ready() &&
                currentMenu.ready() &&
                menuItems.ready()
            );
        }
        else {
            // set reactive var for all subscriptions ready
            this.skeleSubsReady.set(Skeletor.subsManagers.menusSubs.ready());
        }
    });
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
