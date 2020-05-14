# Boiled Page accordion script

A simple, lightweight and customizable accordion JavaScript module for Boiled Page frontend framework that can be used for accordions, sidenavs, etc...

## Install

Place `accordion.js` to `/assets/js` directory and add its path to `scripts` variable in `gulpfile.js` to be combined with other scripts. You can also find two related SCSS packages, an accordion component and a sidenav singleton that work well with this JavaScript module.

- Accordion component: <https://www.github.com/abelbrencsan/boiled-page-accordion-component>
- Sidenav singleton: <https://www.github.com/abelbrencsan/boiled-page-sidenav-singleton>

## Usage

To create a new accordion instance, call `Accordion` constructor the following way:

```js
// Create new accordion instance
var accordion = new Accordion(options);

// Initialize accordion instance
accordion.init();
```

## Options

Available options for accordion constructor:

Option| Type | Default | Required | Description
------|------|---------|----------|------------
`items` | Array | [] | Yes | Array of accordion items. `trigger` and `element` properties must be defined for each item.
`initialIndex` | Number | null | No | Index of initially opened accordion item.
`initCallback` | Function | null | No | Callback function after accordion is initialized.
`destroyCallback` | Function | null | No | Callback function after accordion is destroyed.
`isOpenedClass` | String | 'is-opened' | No | Class added to element when accordion item is opened.
`isActiveClass` | String | 'is-active' | No | Class added to trigger when accordion item is closed.

Available options for an accordion item object:

Option| Type | Default | Required | Description
------|------|---------|----------|------------
`element` | Object | null | Yes | Element is opened and closed on accordion items's trigger click.
`trigger` | Object | null | Yes | Trigger opens and closes accordion items's element on click.

## Methods

### Initialize accordion

`init()` - Initialize accordion, open initial item when initial index is set.

### Open accordion by given item

`open(item)` - Open given accordion item, set maximum height of its element.

Parameter | Type | Required | Description
----------|------|----------|------------
`item` | Object | Yes | Accordion item to be opened.

### Open accordion by given item

`close(item)` - Close given accordion item, reset maximum height of its element.

Parameter | Type | Required | Description
----------|------|----------|------------
`item` | Object | Yes | Accordion item to be closed.

### Recalculate maximum height of opened accordion item's element

`recalcHeight()` - Recalculate maximum height of opened accordion item's element. Call this function when inner height has been possibly changed (window resize, breakpoint change, etc...).

### Destroy accordion

`destroy()` - Destroy accordion. It removes all related classes and events.

### Check accordion is initialized or not

`getIsInitialized()` - Check accordion is initialized or not. It returns `true` when it is already initialized, `false` if not.
