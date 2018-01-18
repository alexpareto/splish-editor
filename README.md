# Splish-Desktop

Setup:

* Install opencv and electron

```
> yarn install # installs node packages
> yarn run electron-rebuild # builds opencv node bindings
> yarn start # runs electron
```

Installing NPM Packages:

```
> yarn add package-name
> yarn run electorn-rebuild # remember this part!
```

## Style guidelines:

Official colors:

| Hex     | Color                                               |
| ------- | --------------------------------------------------- |
| #000000 | <img src="https://dummyimage.com/30/000000/000000"> |
| #6369D1 | <img src="https://dummyimage.com/30/6369D1/6369D1"> |
| #EF233C | <img src="https://dummyimage.com/30/EF233C/EF233C"> |

# Testing Production Apps

If you want to generate a production .app for testing run:

```
yarn run pack
```

# Releases

To create a release first obtain a github token from [here](https://github.com/settings/tokens/new) and make sure that it has the `repo` permission.

then run:

```
export GH_TOKEN=yourtokenhere
yarn run dist
```

This will create a bundle for the application and push the binaries as a new release to github if the version number is new (as a draft). If the version number is the same then it will update the release of that version.

Before users recieve a notifcation with an update you must go to the [releases page](https://github.com/barooapp/splish-desktop/releases) and publish the release. Our update server polls about every 15 minutes. Users will recieve a notification after our update server updates.

You can view our update server [here](https://desktop-update.splish.io/). It's built on [hazel](https://github.com/zeit/hazel).
