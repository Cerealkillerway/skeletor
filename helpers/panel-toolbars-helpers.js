// LangBar
Template.langBar.helpers({
    langs: function() {
        let result = [];

        // register dependency from configuration document
        Skeletor.Registry.configurationChanged.get();

        _.each(Skeletor.configuration.langEnable, function(value, key) {
            if (value) {
                result.push(key);
            }
        });

        return result;
    },
    social: function() {
        let result = [];

        Skeletor.configuration.social.forEach(function(item, index) {
            if (item.enabled) {
                result.push({
                    type: item.type,
                    url: item.url
                });
            }
        });

        if (result.length > 0) {
            return result;
        }
        else {
            return false;
        }
    },
    isActiveLang: function(buttonLang) {
        if (Skeletor.Skelelang.i18n.currentLocale.get() === buttonLang) {
            return 'active';
        }
    }
});

// status bar
Template.statusBar.helpers({
    statusColor: function() {
        switch (Meteor.status().status) {
            case 'connected':
                return 'light-green accent-3';

            case 'connecting':
                return 'yellow accent-3';

            case 'failed':
                return 'deep-purple darken-3';

            case 'waiting':
                return 'orange darken-3';

            case 'offline':
                return 'red accent-4';
        }
    }
});
