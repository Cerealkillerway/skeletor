// Panel layout
Template.panelLayout.onCreated(function() {
    Skeletor.appRendered = new ReactiveVar(false);
});
Template.panelLayout.onRendered(function() {
    setPanelBackground();
    $('.button-collapse').sideNav({
        closeOnClick: true,
        edge: 'right'
    });
    ckSwingMenu(this, '.iconSwing');

    // used by skeleform to understand when all templates are rendered (ex. to init staticbar)
    Skeletor.appRendered.set(true);
});
Template.panelLayout.events({
    'click #logout': function(event) {
        Meteor.logout(function(error) {
            FlowRouter.go(Skeletor.configuration.login.defaultLogoutPath, {}, {lang: FlowRouter.current().queryParams.lang});
        });
    },
    'click .backTop': function(event) {
        skeleUtils.globalUtilities.scrollTo(0, Skeletor.configuration.animations.scrollTop);
    }
});


// Login
Template.login.onRendered(function() {
    setPanelBackground();
    $('#email').focus();
});
Template.login.events({
    'keypress': function(event) {
        if (event.charCode === 13) {
            login();
        }
    },
    'click #login': function(event) {
        login();
    }
});


// Dashboard
Template.dashboard.onRendered(function() {
    TooltipOnRendered();
});
Template.dashboard.onDestroyed(function() {
    TooltipOnDestroyed();
});


// Panel footer
Template.panelFooter.onRendered(function() {
    TooltipOnRendered();
});
Template.panelFooter.onDestroyed(function() {
    TooltipOnDestroyed();
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

            let currentUser = Skeletor.subsManagers.usersSubs.subscribe('findDocuments', 'Users', userQuery, {});
        }

        // set reactive var for all subscriptions ready
        this.skeleSubsReady.set(
            Skeletor.subsManagers.usersSubs.ready() &&
            Skeletor.subsManagers.rolesSubs.ready()
        );
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

            let currentRole = Skeletor.subsManagers.usersSubs.subscribe('findDocuments', 'Roles', roleQuery, {});
        }

        // set reactive var for all subscriptions ready
        this.skeleSubsReady.set(Skeletor.subsManagers.usersSubs.ready() && Skeletor.subsManagers.rolesSubs.ready());
    });
});


// Sections
Template.sectionsList.onCreated(function() {
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let defaultLang = Skeletor.configuration.lang.default;
    let sectionsOptions = {};

    sectionsOptions.fields = {};

    this.autorun(() => {
        let currentLang = FlowRouter.getParam('itemLang');

        sectionsOptions.fields[currentLang + '---code'] = 1;
        sectionsOptions.fields[currentLang + '---name'] = 1;

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

            let currentSection = Skeletor.subsManagers.sectionsSubs.subscribe('findDocuments', 'Sections', sectionQuery, {});
        }

        // set reactive var for all subscriptions ready
        this.skeleSubsReady.set(Skeletor.subsManagers.sectionsSubs.ready());
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
            menu: 1
        }
    };
    let sectionOptions = {
        fields: {}
    };
    let menuOptions = {
        fields: {}
    };

    sectionOptions.fields = {};

    this.autorun(() => {
        let currentLang = FlowRouter.getParam('itemLang');

        pagesOptions.fields[currentLang + '---title'] = 1;
        pagesOptions.fields[currentLang + '---code'] = 1;
        pagesOptions.fields[currentLang + '---published'] = 1;

        sectionOptions.fields[currentLang + '---code'] = 1;
        sectionOptions.fields[currentLang + '---name'] = 1;

        menuOptions.fields[currentLang + '---code'] = 1;
        menuOptions.fields[currentLang + '---name'] = 1;


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
        let code = FlowRouter.getParam('code');

        // needed for both update and creation
        let pageCodes = Skeletor.subsManagers.pagesSubs.subscribe('findDocuments', 'Pages', {}, pageOptions);

        pageOptions.fields[currentLang + '---code'] = 1;
        pageOptions.fields[currentLang + '---published'] = 1;

        sectionOptions.fields[currentLang + '---code'] = 1;
        sectionOptions.fields[currentLang + '---name'] = 1;

        menuOptions.fields[currentLang + '---code'] = 1;
        menuOptions.fields[currentLang + '---name'] = 1;

        let sectionCodes = Skeletor.subsManagers.sectionsSubs.subscribe('findDocuments', 'Sections', {}, sectionOptions);
        let menuCodes = Skeletor.subsManagers.menusSubs.subscribe('findDocuments', 'Menus', {}, menuOptions);

        // case updating record
        if (code) {
            pageQuery[segmentLang + '---code'] = code;
            let currentPage = Skeletor.subsManagers.pagesSubs.subscribe('findDocuments', 'Pages', pageQuery, {});
            let pageCodes = Skeletor.subsManagers.pagesSubs.subscribe('findDocuments', 'Pages', {}, pageOptions);
            let sectionCodes = Skeletor.subsManagers.sectionsSubs.subscribe('findDocuments', 'Sections', {}, sectionOptions);
            let menuCodes = Skeletor.subsManagers.menusSubs.subscribe('findDocuments', 'Menus', {}, menuOptions);
        }

        // set reactive var for all subscriptions ready
        this.skeleSubsReady.set(
            Skeletor.subsManagers.pagesSubs.ready() &&
            Skeletor.subsManagers.sectionsSubs.ready() &&
            Skeletor.subsManagers.menusSubs.ready()
        );
    });
});


// Menus
Template.menusList.onCreated(function() {
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let defaultLang = Skeletor.configuration.lang.default;
    let menusOptions = {};

    menusOptions.fields = {};

    this.autorun(() => {
        let currentLang = FlowRouter.getParam('itemLang');

        menusOptions.fields[currentLang + '---code'] = 1;
        menusOptions.fields[currentLang + '---name'] = 1;

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
        let code = FlowRouter.getParam('code');

        // needed for both update and creation
        menusOptions.fields[currentLang + '---code'] = 1;

        let menusList = Skeletor.subsManagers.menusSubs.subscribe('findDocuments', 'Sections', {}, menusOptions);

        // case updating record
        if (code) {
            menuQuery[segmentLang + '---code'] = code;

            let currentMenu = Skeletor.subsManagers.menusSubs.subscribe('findDocuments', 'Sections', menuQuery, {});
        }

        // set reactive var for all subscriptions ready
        this.skeleSubsReady.set(Skeletor.subsManagers.menusSubs.ready());
    });
});

TooltipOnRendered = function() {
    Tracker.autorun(function() {
        let currentLang = TAPi18n.getLanguage();

        this.$('.tooltipped').tooltip('remove');
        this.$('.tooltipped').tooltip({delay: 50});
    });
};
TooltipOnDestroyed = function() {
    this.$('.tooltipped').tooltip('remove');
};

Template.skeleTooltip.onRendered(function() {
    TooltipOnRendered();
});
Template.skeleTooltip.onDestroyed(function() {
    TooltipOnDestroyed();
});
