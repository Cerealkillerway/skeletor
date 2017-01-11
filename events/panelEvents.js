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
    this.$('.tooltipped').ckTooltip({delay: 10, container: this.$('#dashboardBtns')});
});

// Panel footer
Template.panelFooter.onRendered(function() {
    this.$('.tooltipped').ckTooltip({delay: 10, container: this.$('#panelFooter')});
});


// Users
Template.usersList.onCreated(function() {
    this.skeleSubsReady = new ReactiveVar(false);
    // subscribe data
    let userOptions = {};
    let rolesOptions = {};

    userOptions.fields = {
        username: 1,
        'profile.roles': 1
    };
    rolesOptions.fields = {
        name: 1
    };

    this.autorun(() => {
        let usersList = Skeletor.subsManagers.usersSubs.subscribe('findDocuments', 'Users', {}, userOptions);
        let rolesList = Skeletor.subsManagers.usersSubs.subscribe('findDocuments', 'Roles', {}, rolesOptions);

        // set reactive var for all subscriptions ready
        this.skeleSubsReady.set(Skeletor.subsManagers.usersSubs.ready());
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

        if (username) {
            userQuery.username = username;

            let currentUser = Skeletor.subsManagers.usersSubs.subscribe('findDocuments', 'Users', userQuery, {});
            let usersList = Skeletor.subsManagers.usersSubs.subscribe('findDocuments', 'Users', {}, usersOptions);
            let rolesList = Skeletor.subsManagers.usersSubs.subscribe('findDocuments', 'Roles', {}, rolesOptions);

            // set reactive var for all subscriptions ready
            this.skeleSubsReady.set(Skeletor.subsManagers.usersSubs.ready());
        }
    });
});
