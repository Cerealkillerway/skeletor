// Panel layout
Template.panelLayout.rendered = function() {
    setPanelBackground();
    $(".button-collapse").sideNav({
        closeOnClick: true,
        edge: 'right'
    });
    ckSwingMenu(this, '.iconSwing');
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
// user list
Template.usersList.events({
    "click .deleteUser": function(event) {
        var userToDelete = $(event.target).parent().siblings('.listUsername').html().replace(/<(?:.|\n)*?>/gm, '').trim();
        //console.log(userToDelete);
        $('#panelOkCancelTitle').html(TAPi18n.__("askConfirmation_msg"));
        $('#panelOkCancelMessage').html(TAPi18n.__("deleteConfirmation_msg"));
        $('#panelOkCancel').modal('show');
        
        //on click on modal ok button, go for deletion
        $('#panelOkCancel').on('click', '#panelOkCancelConfirm', function() {
            Meteor.call('deleteUserFromPanel', userToDelete, function(error, result) {

                if (error) {
                    $('#panelErrorTitle').html(TAPi18n.__("delete_error"));
                    $('#panelErrorMessage').html(TAPi18n.__("operationDetail_error") + error.reason);
                    $('#panelError').modal('show');
                }
                else {
                    $('#panelConfirmTitle').html(TAPi18n.__("deleteConfirm_msg"));
                    $('#panelConfirmMessage').html(TAPi18n.__("userDeletionOk_msg"));
                    $('#panelConfirm').modal('show');
                }
            });
        });
        
    }
});


// ROLES
// --- role list ---
Template.rolesList.events({
    "click .deleteRole": function(event) {
        var roleToDelete = $(event.target).parent().siblings('.listRoleName').data('role');
        //console.log(roleToDelete);
        $('#panelOkCancelTitle').html(TAPi18n.__("askConfirmation_msg"));
        $('#panelOkCancelMessage').html(TAPi18n.__("deleteConfirmation_msg"));
        $('#panelOkCancel').modal('show');
        
        //on click on modal ok button, go for deletion
        $('#panelOkCancel').on('click', '#panelOkCancelConfirm', function() {

            Meteor.call('deleteRoleFromPanel', roleToDelete, function(error, result) {

                if (error) {
                    $('#panelErrorTitle').html(TAPi18n.__("delete_error"));
                    $('#panelErrorMessage').html(TAPi18n.__("operationDetail_error") + error.reason);
                    $('#panelError').modal('show');
                }
                else {
                    $('#panelConfirmTitle').html(TAPi18n.__("deleteConfirm_msg"));
                    $('#panelConfirmMessage').html(TAPi18n.__("roleDeletionOk_msg"));
                    $('#panelConfirm').modal('show');
                }
            });
        });
        
    }
});


// --- PAGES ---
// page list
Template.pagesList.events({
    "click .deletePage": function(event) {
        var pageToDelete = $(event.target).parent().siblings('.listPageName').data('page');
        //console.log(roleToDelete);
        $('#panelOkCancelTitle').html(TAPi18n.__("askConfirmation_msg"));
        $('#panelOkCancelMessage').html(TAPi18n.__("deleteConfirmation_msg"));
        $('#panelOkCancel').modal('show');
        
        //on click on modal ok button, go for deletion
        $('#panelOkCancel').on('click', '#panelOkCancelConfirm', function() {

            Meteor.call('deletePageFromPanel', pageToDelete, function(error, result) {

                if (error) {
                    $('#panelErrorTitle').html(TAPi18n.__("delete_error"));
                    $('#panelErrorMessage').html(TAPi18n.__("operationDetail_error") + error.reason);
                    $('#panelError').modal('show');
                }
                else {
                    $('#panelConfirmTitle').html(TAPi18n.__("deleteConfirm_msg"));
                    $('#panelConfirmMessage').html(TAPi18n.__("pageDeletionOk_msg"));
                    $('#panelConfirm').modal('show');
                }
            });
        });
    }
});
