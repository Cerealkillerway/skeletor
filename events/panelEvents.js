// Panel layout
Template.panelLayout.rendered = function() {
    setPanelBackground();
    $('.button-collapse').sideNav({
        closeOnClick: true,
        edge: 'right'
    });
    ckSwingMenu(this, '.iconSwing');

    Session.set('appRendered', true);     // used by skeleform to understand when all templates are rendered (ex. to init staticbar)
};
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
Template.login.rendered = function() {
    setPanelBackground();
    $('#email').focus();
};
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
Template.dashboard.rendered = function() {
    this.$('.tooltipped').ckTooltip({delay: 10, container: this.$('#dashboardBtns')});
};

// Panel footer
Template.panelFooter.rendered = function() {
    this.$('.tooltipped').ckTooltip({delay: 10, container: this.$('#panelFooter')});
};
