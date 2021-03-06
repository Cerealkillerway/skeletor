      ___________          .__          __                
     /   _____/  | __ ____ |  |   _____/  |_  ___________
     \_____  \|  |/ // __ \|  | _/ __ \   __\/  _ \_  __ \
     /        \    <\  ___/|  |_\  ___/|  | (  <_> )  | \/
    /_______  /__|_ \\___  >____/\___  >__|  \____/|__|   
            \/     \/    \/          \/                   

v3.13.19

#### 0 Intro

**Skeletor** is a meteor package that implements a set of features for creating fast and rich CRUD web applications.

It is not meant to be a cms; this is for coders only; knowledge of meteor.js is required to take best from Skeletor;  
The project is based on *MaterializeCSS* framework, *ostrio:i18n* for managing translations, *summernote.js* (as it uses *materialNote* that is built from it);   
This is the main package, that as some dependencies; please note that **skelelang** is meant to be a top-level dependency in your project:

- **skeleform**: is the core for forms' creation; it provides a set of field types and all the functions to manage their values, validate and persist them;
- **skelelist**: handles documents list views, pagination, actions...
- **skeleutils**: provides general and support functions for the above packages and for your application;
- **skelelang**: provide i18n configuration and default lang strings;

You will find detailed informations about everyone of these in their respective readme files.

Other optional packages are available and add functionalities to the skeletor app:

-   **skelesite**: contains relevant collection handling for pages, sections, menus and useful components for frontend;

I've built Skeleform for faster development of my applications; I hope it will help you too...


#### 1 Installation

**Skeletor** is the only top-level dependency you must have in your project:

`meteor add cerealkiller:skeletor`

Optional packages must be added as top level dependencies too:

`meteor add cerealkiller:skelesite`

It also need a Meteor settings file that should contain part of your app's configuration (see chapter 2 for more details);  
so you will run your app with:

`meteor run --settings mySettings.json`


#### 2 Configuration

The application loads its configuration from a "Settings" document named **publicAppConf** and from the Meteor settings file;  
The settings file you must provide can contain everything you need in your app, but must have at least the following public properties:

```javascript
"public": {
    "configuration": {
        "version": "1.12.81",
        "defaultMethods": {
            "create": "skeleCreateDocument",
            "update": "skeleUpdateDocument",
            "delete": "skeleDeleteDocument"
        },
        "social": [],
        "lang": {
            "supported": ["en", "it"],
            "descriptions": {
                "en": "inglese"
                "it": "italiano"
            },
            "enabled": {
                "en": true,
                "it": false
            },
            "default": "en"
        }
    }
}
```
