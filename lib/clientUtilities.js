// set background for panel
setPanelBackground = function() {
    $('body').removeClass('siteBody');
    $('body').addClass('panelBody');
};

// change application current language
changeLang = function(lang) {
    TAPi18n.setLanguage(lang);
    Session.set('currentLang', lang);
    moment.locale(lang);
};

// ck menu icon menu with text description
ckSwingMenu = function(container, className) {
    container.$(className).each(function(index, menuList) {
        $(menuList).prepend('<div class="menuItemName"></div>');
        var nameHolder =  $(menuList).children('.menuItemName');
        var maxMenuHeight = $(menuList).closest('nav').height();
        var cleaner;

        $(menuList).find('li').css({'max-height': maxMenuHeight});
        
        $(menuList).find('li').mouseover(function() {
            var name = $(this).find('.navItemName').html();

            Meteor.clearTimeout(cleaner);
            nameHolder.html(name);
        });

        $(menuList).find('li').mouseout(function() {
            cleaner = Meteor.setTimeout(function() {
                nameHolder.html('');
            }, 1500);
        });
    });
};

// login reusable function
login = function(redirectPath) {
    var email = $('#email').val();
    var password = $('#password').val();
    var message;

    Meteor.loginWithPassword(email, password, function(error) {
        if (error) {
            switch (error.reason) {
                case 'User not found':
                message = TAPi18n.__("userNotFound_error");
                break;

                case 'Incorrect password':
                message = TAPi18n.__("incorrectPassword_error");
                break;
            }

            Materialize.toast(TAPi18n.__("accessDenied_error") + ' - ' + message, 4000);
        }
        else {
            if (redirectPath) FlowRouter.go(redirectPath, {}, {lang: FlowRouter.current().queryParams.lang});
            else FlowRouter.go(Skeletor.configuration.login.defaultRedirectPath, {}, {lang: FlowRouter.current().queryParams.lang});
        }
    });
};
