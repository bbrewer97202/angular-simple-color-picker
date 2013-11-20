angular-simple-color-picker
===========================
A simple angular.js color picker directive.  A color picker is drawn directly into the element without show/hide functionality.  User selections update color model with hexidecimal and RGB values.

Demo: [http://bbrewer97202.github.io/angular-simple-color-picker/index.html](http://bbrewer97202.github.io/angular-simple-color-picker/index.html).

##Installation
Install dependencies (only angular.js) by running:
```shell
bower install
```

##Usage
You may specify width and height values.
```html
<simple-color-picker width="300" height="300" ng-model="color"></simple-color-picker>
```

The color model is an object with "hex" and "rgb" values for convenience, for example:
```javascript
{
    "hex" : "#00e73e",
    "rgb" : {
        "r" : 0,
        "g" : 231,
        "b" : 62
    }
}
```
