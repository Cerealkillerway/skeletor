// Panel layout
Template.panelLayout.rendered = function() {
    setPanelBackground();
    $(".button-collapse").sideNav({
        closeOnClick: true,
        edge: 'right'
    });
    ckSwingMenu(this, '.iconSwing');

    Session.set('appRendered', true);
};
Template.panelLayout.events({
    "click #logout": function(event) {
        Meteor.logout(function(error) {
            FlowRouter.go(Skeletor.configuration.login.defaultLogoutPath, {}, {lang: FlowRouter.current().queryParams.lang});
        });
    },
    "click .backTop": function(event) {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    }
});


// Login
Template.login.rendered = function() {
    setPanelBackground();
    $('#email').focus();
};
Template.login.events({
    "keypress": function(event) {
        if (event.charCode === 13) {
            login();
        }
    },
    "click #login": function(event) {
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


// --- USERS ---
// user update extra buttons
Template.usersList.events({
    "click .skelelistChangePassword": function(event, template) {
        if (template.changePasswordInstance) {
            Blaze.remove (template.changePasswordInstance);
        }

        var id = $(event.target).closest('tr').data('id');
        var item = Meteor.users.findOne({_id: id});

        template.changePasswordInstance = Blaze.renderWithData(Template.userChangePassword, {item: item}, $('#changePassword')[0]);

        $('#skeletorUserChangePasswordModal').openModal();
    }
});
// user change password toolbar
Template.userChangePasswordToolbar.events({
    "click .undoChangePassword": function(event, template) {
        $('#skeletorUserChangePasswordModal').closeModal();
    },
    "click .skeleformChangePassword": function(event, template) {
        if ($('#newPassword').val().length > 5 && $('#newPassword').val() === $('#newPasswordShadowConfirm').val()) {
            Meteor.call('updateUserPassword', template.data.item._id, $('#newPassword').val(), function(error, result) {
                if (error) {
                    Materialize.toast(TAPi18n.__("serverError_error"), 5000, 'error');
                }
                else {
                    Materialize.toast(TAPi18n.__("passwordCanged_msg", template.data.item.username), 5000, 'success');
                    $('#skeletorUserChangePasswordModal').closeModal();
                }
            });
        }
    }
});
