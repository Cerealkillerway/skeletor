// performs security checks and validation before executing methods
// data          => data collected from the form that have to be inserted in the database
// schemaName    => the name of the schema used for the form
// operaton      => a string that can be "insert", "update" or "delete"
Skeletor.Utilities.handleMethodRequest = function(data, schemaName, operation, item) {
    // operations:
    // insert
    // update
    // delete

    'use strict'
    const schema = Skeletor.Schemas[schemaName]
    const collection = schema.__collection
    let result = {}

    // check permissions
    if (!SkeleUtils.Permissions.checkPermissions(Skeletor.Utilities.getPermissions(collection, operation))) {
        throw new Meteor.Error('unauthorized')
    }
    /*else {
        if (Meteor.isServer) {
            console.log('server method: auth ok!')
        }
        if (Meteor.isClient) {
            console.log('client method: auth ok!')
        }
    }*/

    // disallow forced updated, created and time-machine data references
    if (data) {
        if (data.__created) {
            delete data.__created
        }
        if (data.__updated) {
            delete data.__updated
        }
        if (data.edit) {
            delete data.edit
        }
    }

    if (operation !== 'delete') {
        let isValid = Skeletor.Skeleform.validate.checkData(data, schemaName)

        if (_.size(isValid.updatedFields) > 0) {
            _.extend(data, isValid.updatedFields)
        }

        if (!isValid.valid) {
            throw new Meteor.Error(JSON.stringify(isValid), 'serverSideValidation')
        }

        if (schema.__options.timeMachine && operation === 'update') {
            // save current state of fields that are about to be updated
            result.edit = {}
            _.each(data, function(value, key) {
                if (!_.isEqual(value, item[key])) {
                    result.edit[key] = item[key]
                }
            })

            result.edit.__update = {
                user: Meteor.userId(),
                date: moment().format('YYYYMMDD-HH:mm:ss')
            }
        }
    }

    switch (operation) {
        case 'insert':
            if (schema.__options.tracked) {
                data.__created = {
                    user: Meteor.userId(),
                    date: moment().format('YYYYMMDD-HH:mm:ss')
                }
            }
            break

        case 'update':
            if (schema.__options.tracked) {
                data.__updated = {
                    user: Meteor.userId(),
                    date: moment().format('YYYYMMDD-HH:mm:ss')
                }
            }
            break

        case 'delete':
            break
    }

    result.collection = collection
    result.data = data
    return result
}


// performs appropriate subscriptions to needed data for a form or a list based on the schema
// instance        => the template instance
// schemaName      => the name of the schema used by the template
// type            => 'list' or 'detail'
Skeletor.Utilities.autoSubscribe = function(instance, schemaName, type) {
    instance.skeleSubsReady = new ReactiveVar(false)

    let schema = Skeletor.Schemas[schemaName]

    if (!schema.__collection) {
        instance.skeleSubsReady.set(true)
        return
    }

    let options = {}
    let fieldsToShow
    let listSchema = schema.__listView
    let detailLinkParams = listSchema.detailLink.params

    // function to include fields based on currentLang router param
    function includeField(fieldSchema, fieldName, currentLang, options) {
        let defaultLang = Skeletor.configuration.lang.default

        // initialize options object
        if (!options) {
            options = {}
        }
        if (!options.fields) {
            options.fields = {}
        }

        if (fieldSchema.mapTo !== undefined) {
            fieldName = fieldSchema.mapTo(instance)
        }

        if (fieldSchema.i18n === undefined || fieldSchema.i18n === true) {
            options.fields[`${currentLang}---${fieldName}`] = 1

            if (currentLang !== defaultLang) {
                options.fields[`${defaultLang}---${fieldName}`] = 1
            }
        }
        else {
            options.fields[`${fieldName}`] = 1
        }
    }

    // autosubscription for item's detail pages
    if (type === 'detail') {
        fieldsToShow = []

        let readyHandles = []
        let unCachedSubs = false

        function getFields(fields) {
            for (field of fields) {
                if (field.skeleformGroup === true) {
                    if (field.replicaSet) {
                        fieldsToShow.push(field.replicaSet)
                    }
                    else {
                        getFields(field.fields)
                    }
                }
                else {
                    fieldsToShow.push(field)
                }
            }
        }

        getFields(schema.fields)

        instance.autorun(() => {
            let currentLang = Skeletor.FlowRouter.getParam('itemLang')

            for (let fieldToShow of fieldsToShow) {
                let fieldName = fieldToShow.name
                let fieldSchema = fieldToShow

                includeField(fieldSchema, fieldName, currentLang, options)
            }

            let query = {}
            let queryIsUndefined = true

            for (let param of detailLinkParams) {
                if (param !== 'itemLang') {
                    let paramFieldSchema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(schema.fields, param)
                    let paramValue = Skeletor.FlowRouter.getParam(param)

                    if (paramValue !== undefined) {
                        queryIsUndefined = false

                        if (paramFieldSchema.i18n === false) {
                            query[param] = paramValue
                        }
                        else {
                            query[`${currentLang}---${param}`] = paramValue
                        }
                    }
                }
            }

            if (queryIsUndefined) {
                SkeleUtils.GlobalUtilities.logger('Creation form -> no main subscription needed', 'SkeleUtils')
                instance.skeleSubsReady.set(true)
                return
            }

            // subscribe
            // subscription of fields from current schema
            let subManager = schema.__subManager
            let collection = schema.__collection

            SkeleUtils.GlobalUtilities.logger('Auto subscribing to data for DETAIL VIEW with options:', 'SkeleUtils')
            SkeleUtils.GlobalUtilities.logger(`Collection: ${collection}`, 'SkeleUtils')
            SkeleUtils.GlobalUtilities.logger(query)
            SkeleUtils.GlobalUtilities.logger(options)

            if (subManager) {
                Skeletor.subsManagers[subManager].subscribe('findDocuments', collection, query, options, schemaName, undefined, currentLang)
                readyHandles.push(Skeletor.subsManagers[subManager])
            }
            else {
                Meteor.subscribe('findDocuments', collection, query, options, schemaName, undefined, currentLang)
                unCachedSubs = true
            }

            // set ready
            let result = true

            for (let handle of readyHandles) {
                result = result && handle.ready()
            }

            if (unCachedSubs) {
                result = result && instance.subscriptionsReady()
            }

            instance.skeleSubsReady.set(result)
        })
    }


    // autosubscription for list views
    if (type === 'list') {
        fieldsToShow = listSchema.itemFields

        instance.autorun(() => {
            let readyHandles = []
            let unCachedSubs = false
            let currentLang = Skeletor.FlowRouter.getParam('itemLang')
            let sourcedFields = schema.__listView.sourcedFields
            // option object for sourced fields
            // it contains a object for every external schema (ex. Pages_default: {fields: {...}, subManager: ..., collection: ...})
            // for every schema it contains the fields options, a subManager field that tells if the subscription is cached
            // and a collection field
            let sourcedOptions = {}

            // create options object
            // fields inclusion based on itemFields (fields to display in the list view)
            for (let fieldToShow of fieldsToShow) {
                let fieldName = fieldToShow.name
                let fieldSchema

                // handle if field is sourced from another schema
                if (sourcedFields && sourcedFields[fieldName]) {
                    SkeleUtils.GlobalUtilities.logger(`sourced field: ${fieldName}`, 'skeleformCommon')
                    let extSchemaName = sourcedFields[fieldName].schemaName
                    let extSchema = Skeletor.Schemas[extSchemaName]

                    if (!sourcedOptions[extSchemaName]) {
                        sourcedOptions[extSchemaName] = {}
                    }
                    let extOptions = sourcedOptions[extSchemaName]
                    let extFieldName = sourcedFields[fieldName].mapTo

                    fieldSchema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(extSchema.fields, extFieldName)
                    includeField(fieldSchema, extFieldName, currentLang, extOptions)

                    if (extSchema.__subManager) {
                        extOptions.subManager = extSchema.__subManager
                    }
                    extOptions.collection = extSchema.__collection
                }

                // default: field from current schema
                fieldSchema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(schema.fields, fieldName)
                includeField(fieldSchema, fieldName, currentLang, options)
            }

            // fields inclusion based on detailLinkParams (if a param is not already included, add it now)
            for (let param of detailLinkParams) {
                if (param !== 'itemLang') {
                    let fieldSchema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(schema.fields, param)

                    includeField(fieldSchema, param, currentLang, options)
                }
            }

            // subscribe
            // subscription of fields from current schema
            let subManager = schema.__subManager
            let collection = schema.__collection

            SkeleUtils.GlobalUtilities.logger('Auto subscribing to data for LIST VIEW with options:', 'SkeleUtils')
            SkeleUtils.GlobalUtilities.logger(`Collection: ${collection}`, 'SkeleUtils')
            SkeleUtils.GlobalUtilities.logger(options)
            SkeleUtils.GlobalUtilities.logger('Auto subscribing to external data for LIST VIEW with options:', 'SkeleUtils')
            SkeleUtils.GlobalUtilities.logger(sourcedOptions)

            if (subManager) {
                Skeletor.subsManagers[subManager].subscribe('findDocuments', collection, {}, options, schemaName, undefined, currentLang)
                //Skeletor.subsManagers[subManager].subscribe('findDocuments', collection, query, options, schemaName, undefined, currentLang)
                readyHandles.push(Skeletor.subsManagers[subManager])
            }
            else {
                Meteor.subscribe('findDocuments', collection, {}, options, schemaName, undefined, currentLang)
                unCachedSubs = true
            }

            // subscription of fields from external schemas
            _.each(sourcedOptions, (options, schemaName) => {
                if (options.subManager) {
                    let subManager = Skeletor.subsManagers[options.subManager]

                    subManager.subscribe('findDocuments', options.collection, {}, {fields: options.fields}, schemaName, undefined, currentLang)

                    if (readyHandles.indexOf(subManager) < 0) {
                        readyHandles.push(subManager)
                    }
                }
                else {
                    Meteor.subscribe('findDocuments', options.collection, {}, {fields: options.fields}, schemaName, undefined, currentLang)
                }
            })

            // set ready
            let result = true

            for (let handle of readyHandles) {
                result = result && handle.ready()
            }

            if (unCachedSubs) {
                result = result && instance.subscriptionsReady()
            }

            instance.skeleSubsReady.set(result)
        })
    }
}
