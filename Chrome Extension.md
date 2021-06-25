### Getting Started!

Extensions are made of different, but cohesive, components. Components can include background scripts, content scripts, an options page, UI elements and various logic files.

manifest.json => This describes the extension
```json
{  
"name": "Getting Started Example",  
"description": "Build an Extension!",  
"version": "1.0",  
"manifest_version": 3
}
```

Go to `chrome://extensions` and enable developer mode and load unpacked and select this directory.

To add some functionality, Add this in manifest.json
```json
"background": {    
	"service_worker": "background.js"  }
},
"permissions": ["storage"]
```

-> Need permission for the `storage` API to work

Chrome is now aware that the extension includes a service worker. When you reload the extension, Chrome will scan the specified file for additional instructions, such as important events it needs to listen for.

```js 
// background.js
let color = '#3aa757';
chrome.runtime.onInstalled.addListener(() => {
chrome.storage.sync.set({ color });  
console.log('Default background color set to %cgreen', `color: ${color}`);
});
```

Popup UI is used here to iteract with the extension
```json
"action": {
  "default_popup": "popup.html" 
}
```
Can add css to this html as well to style the items in the html
This is what comes when you click on the extension in the toolbar

```json
"default_icon": {      
	"16": "/images/get_started16.png",      
	"32": "/images/get_started32.png",      
	"48": "/images/get_started48.png",      
	"128": "/images/get_started128.png"    
}
```
To add icons to your extension

```json
 "icons": {    
	 "16": "/images/get_started16.png",    
	 - "32": "/images/get_started32.png",    
	 "48": "/images/get_started48.png",    
	 "128": "/images/get_started128.png"  
 }
```
These icons show up on the extension manage papge

cann add .js files to this html too
The color that got saved in the bg.js SW gets retrieved here and the button is set to this style.
```js
// app.js that is loaded in popup.html
let changeColor = document.getElementById("changeColor");
chrome.storage.sync.get("color", ({ color }) => 
	{  
	changeColor.style.backgroundColor = color;
	}
);
```

Now the button ele from the index.html shows up as color set in the bg.js file

```js
// When the button is clicked, inject setPageBackgroundColor into current
pagechangeColor.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ 
		active: true, 
		currentWindow: true 
		});
	chrome.scripting.executeScript({
	target: { tabId: tab.id },
	function: setPageBackgroundColor,  
	});
});
// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {  
	chrome.storage.sync.get("color", ({ color }) => {
	document.body.style.backgroundColor = color;  
	});
}
```
This would fetch the color from the storage in bg.js and then try to set it here. 
It takes the current tab Id and exexcutes a js fucntion to do so.
`chrome.tabs.query` and `chrome.scripting.executeScript` to do so.
These are needed in permission in the manifest file too
```json
 "permissions": ["storage", "activeTab", "scripting"],
```

Options page to change colors as per user's wish
```json
 "options_page": "options.html"
```
in manifest and options.html to show this UI

deatils from the extension dashboard will have a extension options that displays this page for us 
can add .js in this too. 
Now select here the color and update in chrome.storage.sync.set('color', )
Can also do right clikc and options to get to this page.

--- 

Manifest.json
```json
{  
"name": "Hello Extensions",  
"description": "Base Level Extension",  
"version": "1.0",  
"manifest_version": 3,  
"action": {    
	"default_popup": "hello.html", // UI after its clicked
	"default_icon": "hello_extensions.png", // icon on the toolbar
	"default_title": "hello click me!" // shows up on hover
	}
},
"commands": {    
	// for keyboard shortcuts
	"_execute_action": {      
		"suggested_key": {        
			"default": "Ctrl+Shift+F",        
			"mac": "MacCtrl+Shift+F"      
			},      
		"description": "Opens hello.html"    
		}  
	}
}
```
`commands` will register a shortcut that can be used to open this hello.html or can just click and open that too.

[FAQ's](https://developer.chrome.com/docs/extensions/mv3/faq/)

[Outline of the dev](https://developer.chrome.com/docs/extensions/mv3/devguide/)

[API Reference](https://developer.chrome.com/docs/extensions/reference/)

[Examples](https://github.com/GoogleChrome/chrome-extensions-samples)

---

### Manifest.json

[API](https://developer.chrome.com/docs/extensions/mv3/manifest/)
```json
 // Required
  "manifest_version": 3,
  "name": "My Extension",
  "version": "versionString",
```
`short_name` also taken when `name` is too long.
`version` follow sem version preferreable, `version_name` also can be given

[API for action](https://developer.chrome.com/docs/extensions/reference/action/)
`action` deals with clicking on the icon on the toolbar and changing that stuff programatically and all.

Does also have `action.setBadgeBackgroundColor()` and `action.setBadgeText()` this to set badge style notifications for specific tabs as required.

```json
 // Recommended
"action": {
"default_icon" : {
	"16": "images/icon16.png", // For different devices
	"24": "images/icon24.png",
	"32": "images/icon32.png"
},    
"default_title": "Click Me", // Tooltip
"default_popup": "popup.html" // File to open
},
"default_locale": "en",
"description": "A plain text description", // For the webstore
"icons": { 
	"16": "icon16.png",
	"48": "icon48.png",
	"128": "icon128.png" 
}
```

```json
//Optional
"author": ...,
```

This is used to override chrome settings
```json
"chrome_settings_overrides": {
	"homepage": "http://www.homepage.com",    
	"search_provider": { ... }, // setting_override in docs
	"startup_pages": ["http://www.startup.com"]
	}
```

Overriding chrome pages like bookmarks, history, newtab with our own custom HTML. 
These are accessed by`chrome://bookmarks` , `chrome://history`, `chrome://newtab`
Can override only one of these.
```json
"chrome_url_overrides" : {
	"newtab": "myPage.html", // bookmarks, history can also be done
},
```

Shortcuts to interact with actions
`chrome://extensions/shortcuts` to set shortcuts manually.
Ctrl or Alt should be used not together. Shift can be used too.
```json
"commands":{
	"toggle-feature": {
		 "suggested_key": {
			 "default": "Ctrl+Shift+5"
			 "mac": "MacCtrl + Shift + 5",
			 "chromeos": "",
			 "linux": ""
				 },
		 "description": "Toggle feature",
		 "global": true // to make them work outside chrome too
		}
 }
```
Instead of `toggle-feature` it takes `_execute_browser_action` ,`_execute_page_action` and `_execute_action` too with the same object

Can listen to all actions except `_execute_page_action`, `_execute_browser_action` with
```js
chrome.commands.onCommand.addListener(function(command) 
{  console.log('Command:', command); }
);
```

CSP -> Content Security Policy
- Cant do inline scripts in your apps. with `script` tags or `button.onclick` types
- Cant refer any external sources in app
- Cant use `eval()`
- The Content-Security-Policy header allows you to restrict how resources such as JavaScript, CSS, or pretty much anything that the browser loads.

Although it is primarily used as a HTTP response header, you can also apply it via a meta tag. [Read more](https://content-security-policy.com/)

Devtools can get special page too. Those tabs and the other good stuff that dev tools have.
```json
"devtools": "devtool.html"
```

> Come back here to devtool
> background
> content_scripts

```json
"event_rules": [{...}],
```
Event rules has something to do wtih provides a mechanism to add rules that intercept, block, or modify web requests in-flight using declarativeWebRequestor take actions depending on the content of a page, without requiring permission to read the page's content using declarativeContent

The `externally_connectable` manifest property declares which extensions, apps, and web pages can connect to your extension via `runtime.connect`  and `runtime.sendMessage` to send and receive messages from these listed webpages.

```json
"externally_connectable": {
	"ids": [],
	"matches": [], // this matches the match pattern
}
```

```json
"homepage_url": "http://path/to/homepage",
```

```json
 "incognito": "spanning, split, or not_allowed",
```
This will decide how the extension will behave in incognito

```json
"minimum_chrome_version": "versionString",
```

>Nacl modules => with this only it oopens pdf in browsers. Native client modules

from the `chrome.omnibox` API. By doing keyword we can write this in the serach box and hit tab to send commands to our extension
```json
"omnibox": { "keyword" : "aaron" }
```
Listen to these typed things and suggest if you need to with APi
```js
chrome.omnibox.onInputEntered.addListener(function (text, f) {
 // f is enum value
 console.log(text, f);
});
```

Options page (discussed below)
```json
"options_page": "options.html",
"options_ui": {
	"chrome_style": true, // to embed into the view and not show new page
	"page": "options.html"
},
```

Permissions
```json
 "permissions": ["tabs"],
```

`chrome.permissions` API to get permission during runtime for security purposes.
Can also list before itself to use them.

These permission are run only for these tabs specifically then
```json
 "optional_permissions": [ "tabs", "http://www.google.com/" ],
```

On some event ask for permission
```js
chrome.permissions.request({    
	permissions: ['tabs'],
	origins: ['http://www.google.com/']  
	}, 
	function(granted) {    
		granted ? doSomething() : cancel();
	}
);
```

`chrome.permissions.contains` and `chrome.permissions.remove` to check for permissions and to remove them.
`onAdded` and `onRemoved` as events to listen to.

```json
"platforms": ...,
"replacement_web_app": ...,
```

tts is chrome text to speech engine => [Sample code here](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/apps/samples/tts)

```json
"tts_engine": {
	"voices": [
		{
			"voice_name": "Alice",
			"lang": "en-US",
			"event_types": ["start", "marker", "end"]
		},
		{
			"voice_name": "Pat",
			"lang": "en-US",
			"event_types": ["end"]
		}
	]
},
```

Web Accessible resources
```json
"web_accessible_resources": [
	{	
		// match '/images'  recursively and all '.png'. REQUIRED
		"resources": [ *.png", "/images/*" ],
		// origin is used to match. OPTIONAL
		"matches": [ "*.google.com"], 
		"extensions": [/*list of id of extensions allowed to access*/]
		"use_dynamic_url": true
	}
]
```
assets that need to be loaded in web pages, but any asset included in an extension's bundle can be made web accessible.
These resources are available in a webpage via the URL `chrome-extension://[PACKAGE ID]/[PATH]`

---

### Architecture Overview
1. Background script
	- react to events
	- only active when events are fired and then goes idle

2. UI Elementts
	- can have actions either browser or page
	- context menu
	- omni box
	- keyboards shortcuts

3. Content script
	- can access DOM here
	- communicate with parent API via messages and storage API

4. Options Page

Can communicate to each other using message passing
`chrome.extension` API is useful here
`storage` also is used.

---

#### Permissions

-   `permissions`  contain items from a list of known strings (such as "geolocation")
-   `optional_permissions` are like regular `permissions`, but are granted by the extension's user at runtime, rather than in advance
-   `host_permissions` contain one or more match patterns that give access to one or more hosts. Match patterns can be on 

[List of permissions available](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/#:~:text=currently%20available%20permissions%3A-,Permission,-Description)

---

#### Message Passing

Since content scripts run in the context of a web page and not the extension, they often need some way of communicating with the rest of the extension and this happens by use of message passing.

Either side can listen to messages and communicate using the same channel. Message should be a valid JSON object.
Can send messages to other extensions if you know its ID. 

Three types of messages
1. Simple one time requests
	 `runtime.sendMessage` or `tabs.sendMessage` can be used for this. Takes a callback for the optinal response it would get.
	```js
	// send from content script to background
	chrome.runtime.sendMessage({greeting: "hello"}, 
	function(response) {  
		console.log(response.farewell);
		}
	);
	```
	
	```js
	// Send message from backgound script to content script
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" },
			function(response) {    
				console.log(response.farewell);  
				}
			);
		});
	```

	`runtime.onMessage` to listen to these
   ```js
	chrome.runtime.onMessage.addListener(  
		function(request, sender, sendResponse) {    
			console.log(sender.tab ?
						"from a content script:" + sender.tab.url 
						: "from the extension");
			if (request.greeting === "hello")      
				sendResponse({farewell: "goodbye"});
		}
	);
   ```

1. Long lived connections

	 `runtime.connect`or `tabs.connect` to do long lived connections. A good use case could be filling a form of multiple values. This takes two optional parameters, out of which one is a object with a `name` to identify this connection
	 
	 returns  a `runtime.Port` object that is used for sending and receiving messages around.
	 
	```js
	const port = chrome.runtime.connect({name: "knockknock"});
	port.postMessage({joke: "Knock knock"});
	port.onMessage.addListener(function(msg) {  
		if (msg.question === "Who's there?")    
			port.postMessage({answer: "Madame"});  
		});
	```

	Very similar for `tabs.connect` to send messages to content scripts. except that it requiers an id that identifies the tab it needs this message to go to.

	Can listen and react to theses connection establishment events with `runtime.onConnect` listner that would return a `runtime.Port` object as a callback that can be used to send messages to and fro similar to above example.

	`runtime.Port.onDisconnect` listner to listen to the disconnections. 

3. Cross extension messaging

	`runtime.onMessageExternal` and `runtime.onConnectExternal` listners can be used to listen to message and connection events from external extensions.
	
	`chrome.runtime.sendMessage` to send messages to other extensions but only difference is you need to add an `extension-id` that identifies the extension,
	
4. Sending messages from webpages

	`externally_connectable` needs to be set in `manifest.json` for this to be allowed.
	
	`runtime.sendMessage` or `runtime.connect` can be used to send messages from the webpage to the extension providing its ID.
	
	`runtime.onMessageExternal` and `runtime.onConnectExternal` lsitners can be used to listen to these messages.
	
Can also send messages to and from native applications by modifying some paramters on `manifest.json` 

---
#### Content Scripts
Run in the context of the web page. They can use DOM, read details of web pages etc.

`chrome.i18n` and `chrome.storage` API is fully available here.
`chrome.runtime` API some methods are exposed here such as `runtime.getURL` etc.

These are run in isolated envs so that there is no clash between this and the other extensions, pages's own JS running there.
> The webpage, other extension, and content scripts run in their own envs and cannot interfer with each other.

These can be statically declared or inject programatically.

1. Statically declared
	 ```json
	"content_scripts": [   
	{     
		"matches": ["http://*.nytimes.com/*"],
		"css": ["myStyles.css"],
		"js": ["contentScript.js"]
		}
	],
	```
	These run only on these match patterns and nothing else.
	
2. Inject Dynamically
	
	Need permissions to do this `host_permission` or `activeTab`.
	`chrome.scripting` to execute the desired file.
	
`exclude_matches` ,`include_globs`, `exclude_globs` are used to match the pages that content scripts can be executed in. These also take match patterns as values.

Can send and receive messages to the webpage that it is currently interacting with too from this.

---
#### Events
Events like closing a tab, removing a bookmar, etc can be reacted to from these extensions

```json
// manifest.json
"background": {
 	"service_worker": "background.js" 
},
```

`chrome.runtime.onInstalled` can have a listner that would listen to when its installed and react. `chrome.bookmark.onCreated` can be listned too. React to these events inside these callbacks as required.

Can `removeLisnter` on these too to stop listnening to these events.

Always keep storing state with `chrome.storage` and disconnect `ports` if not in use.

---
#### Match Patterns

Its is an URL with `scheme`, `host`, `path`.
`<all_urls>` is special and matches anything given to it.
[For examples](https://developer.chrome.com/docs/extensions/mv3/match_patterns/)

---
#### Promises
Not all API's use promise. Callbacks are there as default if promise is not implemented in it.

---
#### Cross origin requests
Extensions can request to other origins by making request provided they are mentioned in the `manifest` file.
```json
 "host_permissions": [  "https://www.google.com/"  ],
```
This allows it to request from these mentioned URL. These URL's take match patterns as values.

Careful as to see what scripts are exxecuting on your behalf for security concers.
`content-security-policy` can be set in maniffest to alllow such requests.

---
#### Dev Tools

```json
// manifest.json
"devtools_page": "./devtool/devtools.html"
```

-   Create and interact with panels using the `devtools.panels`APIs.
-   Get information about the inspected window and evaluate code in the inspected window using the `devtools.inspectedWindow` APIs.
-   Get information about network requests using the `devtools.network` APIs.

	![[Devtool API Chrome Extension.png]]

Very similar access to API like content script for other pass message around background scripts to get it done.

These are made of `panels` and `sidebar` from the `panels` API.

[API](https://developer.chrome.com/docs/extensions/mv3/devtools/) for devtools overview 

---
Can do request using `chrome.identity` API to ccarry out login requests.
These are carried out using oauth 2.0 behind the scenes.

---
#### Notifications
Can send notifications, list of them, with image previews, progress bars too. 
Can interact with them by listening to events on them

[API](https://developer.chrome.com/docs/extensions/mv3/richNotifications/)

---
#### Background Services
lives independent of any other window or tab. This allows extensions to observe and take action in response to events.

Register all event listners on the top of the file and dont register them in a async way.

This is a service worker essentialy. they are started to handle events they're interested in and are terminated when they're no longer needed. Write code that are shortlived like use `storage` to strore values frequently.

 `setTimeout` or `setInterval` methods. These APIs can fail in service workers, though, because the scheduler will cancel the timers when the service worker is terminated instead use `chrome.alarm` API to handle such events.
 
 ---
 
[All API Reference](https://developer.chrome.com/docs/extensions/reference/)

[Overview of API](https://developer.chrome.com/docs/extensions/mv3/devguide/)

