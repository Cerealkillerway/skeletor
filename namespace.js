import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import numeral from 'numeral';


// numeral.js
// format and manipulate numbers...
// documentation: http://numeraljs.com/
numeral.register('locale', 'it', {
        delimiters: {
            thousands: '.',
            decimal: ','
        },
        abbreviations: {
            thousand: 'mila',
            million: 'mil',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function (number) {
            return 'º';
        },
        currency: {
            symbol: '€'
        }
    });
numeral.locale('it');


// exported object
Skeletor = {
    Utilities: {
        // check if lang queryParam is defined, or set it to defaultLang
        checkLang: function() {
            'use strict';
            let requestedLang = FlowRouter.current().queryParams.lang;

            if (!requestedLang) {
                FlowRouter.setQueryParams({lang: Skeletor.configuration.lang.default});
            }
            else {
                if (!Skeletor.configuration.langEnable[requestedLang]) {
                    FlowRouter.setQueryParams({lang: Skeletor.configuration.lang.default});
                }
            }
        },

        // returns the current lang or the default one
        getLang: function() {
            'use strict';
            let lang = FlowRouter.current().queryParams.lang;

            if (!lang) {
                lang = Skeletor.configuration.lang.default;
            }
            return lang;
        }
    },
    SkeleUtils: SkeleUtils,
    Skelelang: Skelelang,
    private: {},
    numeral: numeral,
    pagePlaceholders: {},
    availableTemplates: {},
    SubsManager: SubsManager,
    FlowRouter: FlowRouter,

    // to be used for application's defined callbacks on skeletor's templates
    customCallbacks: {
        skelePanelLayout: {
            onRendered: undefined
        }
    }
};
