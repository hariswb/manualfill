# Manual Fill
A chrome extension to save form input answers and use it for future use. 

# How to use?
- Chrome extension's content script is running to detect user's click events in the host page.
- When user click on a form input, a toolbar pops up few pixels away from it. 
- The toolbar will show the saved input if it matches the host's form label.
- Else, you can use the toolbar's search form to get the closest answers. 
- Easily fill any saved entr into the host's form input with a single click on the toolbar.

# How does it work?
- This chrome extension uses chrome's content-script API to interact with the browser's page.
- The toolbar is a React app which attaches to the tab's window, specifically in HTML tag, outside the page body.
- Saved answers are stored in the browser's IndexedDB for persistency.
- The storage is accessed via a service-worker running in the background so it's functionality within any browser tabs.
- The content-script's toolbar does CRUD operation to the DB via chrome extension messaging with the background service worker.

# Content script interaction with the host page

The content script interaction with the host page are:
- Listening to user's click events on the page.
- Get the form input element to manipulate.
- Ability to set the value of `input` and `textarea` element with a saved data from the toolbar. 

The toolbar content script lives in a custom tag `manualfill` inside the `html` tag, outside of the host's `body` tag. That is to ensure no resource collision. 

The content-script event listener communicates with the toolbar React app via Zustand state manager. It only sets what's focused input form at the moment. The toolbar React app then use that to manage:
- Whether to show/hide the toolbar.
- Showing the matching entry.
- Get any entries with it's own search form.
- Select what data to fill into the host's focused form input.

# Stacks

The first version was written with vanilla Javascript and managing the app states was too hard to handle. So, the use of React is justifiable IMO.

To manage shared state between content script and the toolbar React app, a state manager is needed although it's still not big enough to use redux. So, Zustand is choosen instead. 

# How to build?

Run `bootstrap` to setup the node env for development. 

The current app only builds the development version.
