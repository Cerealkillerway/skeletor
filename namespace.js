// numeral.js
import numeral from 'numeral';

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
    Utilities: {},
    SkeleUtils: SkeleUtils,
    private: {},
    numeral: numeral,

    // to be used for application's defined callbacks on skeletor's templates
    customCallbacks: {
        skelePanelLayout: {
            onRendered: undefined
        }
    }
};
