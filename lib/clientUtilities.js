// set background for panel
Skeletor.Utilities.skeleSetPanelBackground = function() {
    $('body').removeClass('siteBody');
    $('body').addClass('skelePanelBody');
};

// change application's interface current language
Skeletor.Utilities.changeRouteLang = function(newLang) {
    TAPi18n.setLanguage(newLang);
    moment.locale(newLang);

    FlowRouter.setQueryParams({'lang': newLang});
};


// ck menu icon menu with text description
Skeletor.Utilities.skeleSwingMenu = function(container, className) {
    container.$(className).each(function(index, menuList) {
        $(menuList).prepend('<div class="menuItemName"></div>');

        let nameHolder =  $(menuList).children('.menuItemName');
        let maxMenuHeight = $(menuList).closest('nav').height();
        let cleaner;

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
Skeletor.Utilities.loginWithPassword = function(email, password, redirectPath) {
    let message;

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
            // ensure that autorun cycles are recalculated since the function that gets current user's roles is inside
            // a Tracker.autorun cycle
            Tracker.flush();

            if (redirectPath) {
                FlowRouter.go(redirectPath, {}, {lang: FlowRouter.current().queryParams.lang});
            }
            else {
                FlowRouter.go(Skeletor.configuration.login.defaultRedirectPath, {}, {lang: FlowRouter.current().queryParams.lang});
            }
        }
    });
};
