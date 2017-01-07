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
