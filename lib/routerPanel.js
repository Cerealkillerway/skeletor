// check authorizations for general panel access
Skeletor.Utilities.checkAuth = function(current) {
    if (!Meteor.userId() || !checkPermissions("panelAccess", Meteor.userId())) {
        return FlowRouter.go(Skeletor.configuration.login.defaultLoginPath, {}, {lang: Skeletor.Utilities.getLang()});
    }
};

// check if lang queryParam is defined, or set it to defaultLang
Skeletor.Utilities.checkLang = function() {
    var requestedLang = FlowRouter.current().queryParams.lang;

    if (!requestedLang) {
        FlowRouter.setQueryParams({lang: Skeletor.configuration.lang.default});
    }
    else {
        if (!Skeletor.GlobalConf.langEnable[requestedLang]) {
            FlowRouter.setQueryParams({lang: Skeletor.configuration.lang.default});
        }
    }
};

// returns the current lang or the default one
Skeletor.Utilities.getLang = function() {
    var lang = FlowRouter.current().queryParams.lang;

    if (!lang) {
        lang = Skeletor.configuration.lang.default;
    }
    return lang;
};




// login
FlowRouter.route('/login', {
    triggersEnter: [Skeletor.Utilities.checkLang],
    action: function(params, queryParams) {
        BlazeLayout.render("login");
    }
});

FlowRouter.route("/panel", {
    triggersEnter: [Skeletor.Utilities.checkAuth],
    action: function(params, queryParams) {
        FlowRouter.go("/panel/dashboard", {}, {lang: Skeletor.Utilities.getLang()});
    }
});

// panel group-route
Skeletor.PanelRoutes = FlowRouter.group({
    prefix: "/panel",
    triggersEnter: [Skeletor.Utilities.checkAuth, Skeletor.Utilities.checkLang],
});


// ======= PANEL ROUTES ==============================================>
// dashboard
Skeletor.PanelRoutes.route('/dashboard', {
    action: function(params, queryParams) {
        BlazeLayout.render("panelLayout", {main: "dashboard"});
    }
});


// users
// =======================================================================
Skeletor.PanelRoutes.route('/users', {
    subscriptions: function(params, queryParams) {
        var options = {};
        options.fields = {
            username: 1,
            "profile.roles": 1
        };
        this.register("usersList", Skeletor.subman.subscribe("findDocuments", 'Users', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'usersList'});
    }
});
Skeletor.PanelRoutes.route('/users/create', {
    subscriptions: function() {
        var options = {};
            options.fields = {
                username: 1
            };

        this.register("usernames", Skeletor.subman.subscribe("findDocuments", 'Users', {}, options));
        this.register("roles", Skeletor.subman.subscribe("findDocuments", "Roles", {}, {}));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "userCreate"});
    }
});
Skeletor.PanelRoutes.route('/users/:username', {
    subscriptions: function(params, queryParams) {
        var query = {};
        var options = {};
            options.fields = {
                username: 1
            };

        query.username = params.username;

        this.register("user", Skeletor.subman.subscribe("findDocuments", 'Users', query, {}, true));
        this.register("usernames", Skeletor.subman.subscribe("findDocuments", 'Users', {}, options));
        this.register("roles", Skeletor.subman.subscribe("findDocuments", "Roles", {}, {}));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "userCreate"});
    }
});


// roles
// =======================================================================
Skeletor.PanelRoutes.route('/roles', {
    subscriptions: function() {
        var options = {};
            options.fields = {
                name: 1
            };

        this.register("rolesList", Skeletor.subman.subscribe("findDocuments", 'Roles', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: 'rolesList'});
    }
});
Skeletor.PanelRoutes.route('/roles/create', {
    subscriptions: function() {
        var options = {};
            options.fields = {
                name: 1
            };

        this.register("roleNames", Skeletor.subman.subscribe("findDocuments", 'Roles', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "roleCreate"});
    }
});
Skeletor.PanelRoutes.route('/roles/:name', {
    subscriptions: function() {
        var options = {};
            options.fields = {
                name: 1
            };

        this.register("roleNames", Skeletor.subman.subscribe("findDocuments", 'Roles', {}, options));
        this.register("role", Skeletor.subman.subscribe("findDocuments", "Roles", {}, {}, true));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "roleCreate"});
    }
});


// sections
// =======================================================================
Skeletor.PanelRoutes.route('/sections/:itemLang', {
    subscriptions: function(params, queryParams) {
        var currentLang = params.itemLang;
        var defaultLang = Skeletor.configuration.lang.default;
        var sectionOptions = {};

        sectionOptions.fields = {};
        sectionOptions.fields[currentLang + '.code'] = 1;
        sectionOptions.fields[currentLang + '.name'] = 1;

        // if currentLang is not the defaultLang, always include at least the fields needed on the listView
        // otherwise if you refresh on the listView with non defaultLang and then move to defaultLang, due to DDP limitations
        // the defaultLang's fields will not be available
        if (currentLang !== defaultLang) {
            sectionOptions.fields[defaultLang + '.code'] = 1;
            sectionOptions.fields[defaultLang + '.name'] = 1;
            sectionOptions.fields[defaultLang + '.published'] = 1;
        }

        this.register("sectionsList", Skeletor.subman.subscribe("findDocuments", 'Sections', {}, sectionOptions));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "sectionsList"});
    }
});
Skeletor.PanelRoutes.route('/sections/:itemLang/create', {
    subscriptions: function(params, queryParams) {
        var options = {};
            options.fields = {};

        options.fields[params.itemLang + '.code'] = 1;

        this.register("sectionNames", Skeletor.subman.subscribe("findDocuments", 'Sections', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "sectionCreate"});
    }
});
Skeletor.PanelRoutes.route('/sections/:itemLang/:code', {
    subscriptions: function(params, queryParams) {
        var currentLang = params.itemLang;
        var segmentLang = queryParams.sLang;
        var sectionQuery = {};
        var options = {};
            options.fields = {};

        sectionQuery[segmentLang + '.code'] = params.code;
        options.fields[currentLang + '.code'] = 1;

        this.register("sectionData", Skeletor.subman.subscribe("findDocuments", 'Sections', sectionQuery, {}, true));
        this.register("sectionNames", Skeletor.subman.subscribe("findDocuments", 'Sections', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "sectionCreate"});
    }
});


// pages
// =======================================================================
Skeletor.PanelRoutes.route('/pages/:itemLang', {
    subscriptions: function(params, queryParams) {
        var currentLang = params.itemLang;
        var defaultLang = Skeletor.configuration.lang.default;
        var pageOptions = {
            fields: {
                section: 1,
                menu: 1
            }
        };
        var sectionOptions = {
            fields: {}
        };
        var menuOptions = {
            fields: {}
        };

        pageOptions.fields[currentLang + '.code'] = 1;
        pageOptions.fields[currentLang + '.published'] = 1;
        // if currentLang is not the defaultLang, always include at least the fields needed on the listView
        // otherwise if you refresh on the listView with non defaultLang and then move to defaultLang, due to DDP limitations
        // the defaultLang's fields will not be available
        if (currentLang !== defaultLang) {
            pageOptions.fields[defaultLang + '.code'] = 1;
            pageOptions.fields[defaultLang + '.published'] = 1;
        }

        sectionOptions.fields[currentLang + '.code'] = 1;    // needed! If not 'code' field will not be available on section list
        sectionOptions.fields[currentLang + '.name'] = 1;
        // if currentLang is not the defaultLang, always include at least the fields needed on the listView
        // otherwise if you refresh on the listView with non defaultLang and then move to defaultLang, due to DDP limitations
        // the defaultLang's fields will not be available
        if (currentLang !== defaultLang) {
            sectionOptions.fields[defaultLang + '.code'] = 1;
            sectionOptions.fields[defaultLang + '.name'] = 1;
        }

        menuOptions.fields[currentLang + '.code'] = 1;       // needed! If not 'code' field will not be available on menu list
        menuOptions.fields[currentLang + '.name'] = 1;
        // if currentLang is not the defaultLang, always include at least the fields needed on the listView
        // otherwise if you refresh on the listView with non defaultLang and then move to defaultLang, due to DDP limitations
        // the defaultLang's fields will not be available
        if (currentLang !== defaultLang) {
            menuOptions.fields[defaultLang + '.code'] = 1;
            menuOptions.fields[defaultLang + '.name'] = 1;
        }

        this.register('pagesList', Skeletor.subman.subscribe("findDocuments", 'Pages', {}, pageOptions));
        this.register('sectionCodes', Skeletor.subman.subscribe('findDocuments', 'Sections', {}, sectionOptions));
        this.register('menuCodes', Skeletor.subman.subscribe('findDocuments', 'Menus', {}, menuOptions));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "pagesList"});
    }
});
Skeletor.PanelRoutes.route('/pages/:itemLang/create', {
    subscriptions: function(params, queryParams) {
        var pageOptions = {
            fields: {}
        };
        var sectionOptions = {
            fields: {}
        };
        var menuOptions = {
            fields: {}
        };

        pageOptions.fields[params.itemLang + '.code'] = 1;
        pageOptions.fields[params.itemLang + '.published'] = 1;

        sectionOptions.fields[params.itemLang + '.code'] = 1;
        sectionOptions.fields[params.itemLang + '.name'] = 1;

        menuOptions.fields[params.itemLang + '.code'] = 1;
        menuOptions.fields[params.itemLang + '.name'] = 1;

        this.register("pageCodes", Skeletor.subman.subscribe('findDocuments', 'Pages', {}, pageOptions));
        this.register('sectionCodes', Skeletor.subman.subscribe('findDocuments', 'Sections', {}, sectionOptions));
        this.register('menuCodes', Skeletor.subman.subscribe('findDocuments', 'Menus', {}, menuOptions));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "pageCreate"});
    }
});
Skeletor.PanelRoutes.route('/pages/:itemLang/:code', {
    subscriptions: function(params, queryParams) {
        var pageQuery = {};
        var currentLang = params.itemLang;
        var defaultLang = Skeletor.configuration.lang.default;
        var segmentLang = queryParams.sLang;
        var pageOptions = {
            fields: {}
        };
        var sectionOptions = {
            fields: {}
        };
        var menuOptions = {
            fields: {}
        };

        pageQuery[segmentLang + '.code'] = params.code;
        pageOptions.fields[currentLang + '.code'] = 1;
        pageOptions.fields[currentLang + '.published'] = 1;

        sectionOptions.fields[currentLang + '.code'] = 1;
        sectionOptions.fields[currentLang + '.name'] = 1;
        if (currentLang !== defaultLang) {
            sectionOptions.fields[defaultLang + '.code'] = 1;
            sectionOptions.fields[defaultLang + '.name'] = 1;
        }

        menuOptions.fields[currentLang + '.code'] = 1;
        menuOptions.fields[currentLang + '.name'] = 1;
        if (currentLang !== defaultLang) {
            menuOptions.fields[defaultLang + '.code'] = 1;
            menuOptions.fields[defaultLang + '.name'] = 1;
        }

        this.register("pageData", Skeletor.subman.subscribe("findDocuments", 'Pages', pageQuery, {}, true));
        this.register("pageCodes", Skeletor.subman.subscribe("findDocuments", 'Pages', {}, pageOptions));
        this.register('sectionCodes', Skeletor.subman.subscribe('findDocuments', 'Sections', {}, sectionOptions));
        this.register('menuCodes', Skeletor.subman.subscribe('findDocuments', 'Menus', {}, menuOptions));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "pageCreate"});
    }
});

// menus
// =======================================================================
Skeletor.PanelRoutes.route('/menus/:itemLang', {
    subscriptions: function(params, queryParams) {
        var currentLang = params.itemLang;
        var defaultLang = Skeletor.configuration.lang.default;
        var options = {};

        options.fields = {};
        options.fields[params.itemLang + '.code'] = 1;
        options.fields[params.itemLang + '.name'] = 1;

        // if currentLang is not the defaultLang, always include at least the fields needed on the listView
        // otherwise if you refresh on the listView with non defaultLang and then move to defaultLang, due to DDP limitations
        // the defaultLang's fields will not be available
        if (currentLang !== defaultLang) {
            options.fields[defaultLang + '.code'] = 1;
            options.fields[defaultLang + '.name'] = 1;
        }

        this.register("menusList", Skeletor.subman.subscribe("findDocuments", 'Menus', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "menusList"});
    }
});
Skeletor.PanelRoutes.route('/menus/:itemLang/create', {
    subscriptions: function(params, queryParams) {
        var options = {};
            options.fields = {};

        options.fields[params.itemLang + '.code'] = 1;

        this.register("sectionNames", Skeletor.subman.subscribe("findDocuments", 'Sections', {}, options));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "menuCreate"});
    }
});
Skeletor.PanelRoutes.route('/menus/:itemLang/:code', {
    subscriptions: function(params, queryParams) {
        var currentLang = params.itemLang;
        var segmentLang = queryParams.sLang;
        var menuQuery = {};

        menuQuery[segmentLang + '.code'] = params.code;

        this.register("menuData", Skeletor.subman.subscribe("findDocuments", 'Menus', menuQuery, {}, true));
    },
    action: function() {
        BlazeLayout.render('panelLayout', {main: "menuCreate"});
    }
});

// ======= END PANEL ROUTES ===================================




// 404 catchall route (must be the last one!)
/*Skeletor.PanelRoutes.route('/(.*)', {
    action: function() {
        BlazeLayout.render('panelLayout', {main: "404"});
    }
});*/
