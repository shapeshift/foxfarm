# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

You may get a 404 error if you don't add /fox-farming to the url.

If you get the error "Failed to replace env in config: ${NPM_TOKEN}" then node has added some unnecessary files. Remove them with: rm -f ./.npmrc

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## VPN

Seeing `forbidden` when on the VPN and trying to access the staging domains? Browse to https://icanhazip.com . If it returns an IPv4 IP (looks like: `192.168.0.1`) then something else may be wrong and you should talk to CorpIT/DevOps about it. If it returns an IPv6 IP (looks like: `::ffff:c000:0290`, `::ffff:192.168.2.128`), then you need to disable IPv6 on your network connection. Here are quick instructions on how to do that in MacOS:

https://support.nordvpn.com/Connectivity/macOS/1047410442/How-to-disable-IPv6-on-macOS.htm

tl;dr
```
sudo networksetup -setv6off Ethernet
sudo networksetup -setv6off Wi-Fi
```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
