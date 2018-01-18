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

# Deployment

We use electron-builder for deployment and keep our deployments in an s3 bucket. Want to make a new deployment?

1. Update the version in package.json to a new value
2. Run `yarn run dist`. This will make a distribution and upload it to s3.
3. Done! Users will be notified of the new version.
   _side note: you will need to have aws credentials configured to make a deployment_

Notes on deployment:

* When we are working on a new release (that is not public yet) it is marked in the package.json with a version-snapshot (e.g. `0.1.0-snapshot`). This indicates it is not a public release, but rather an internal release (for the future 0.1.0 public release).
* In order to release a new real version we remove the -snapshot (e.g. `0.1.0`). Run `yarn run dist`. Then we increment the said package.json version for future development (`0.2.0-snapshot`).
