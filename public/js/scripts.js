var app = angular.module('app', []);

app.directive('simpleColorPicker', ['$compile', function($compile) {

  /**
   * create a HTML canvas element
   * param width 
   * param height
   * @returns object with reference to canvas element and canvas context
   */
  var createPicker = function(width, height) {

    var canvas = document.createElement('canvas');
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    canvas.setAttribute("style", "cursor:crosshair");
    canvas.setAttribute("class", "simpleColorPicker");

    var context = canvas.getContext('2d');

    var colorGradient = context.createLinearGradient(0, 0, width, 0);
    colorGradient.addColorStop(0, "rgb(255,0,0)");
    colorGradient.addColorStop(0.15, "rgb(255,0,255)");
    colorGradient.addColorStop(0.33, "rgb(0,0,255)");
    colorGradient.addColorStop(0.49, "rgb(0,255,255)");
    colorGradient.addColorStop(0.67, "rgb(0,255,0)");
    colorGradient.addColorStop(0.84, "rgb(255,255,0)");
    colorGradient.addColorStop(1, "rgb(255,0,0)");
    context.fillStyle = colorGradient;
    context.fillRect(0, 0, width, height);

    var bwGradient = context.createLinearGradient(0, 0, 0, height);
    bwGradient.addColorStop(0, "rgba(255,255,255,1)");
    bwGradient.addColorStop(0.5, "rgba(255,255,255,0)");
    bwGradient.addColorStop(0.5, "rgba(0,0,0,0)");
    bwGradient.addColorStop(1, "rgba(0,0,0,1)");

    context.fillStyle = bwGradient;
    context.fillRect(0, 0, width, height); 

    return {
      canvas: canvas,
      context: context
    }
  };

  /**
   * given a mouse click event, return x,y coordinates relative to the clicked target
   * @returns object with x, y values
   * base source: http://stackoverflow.com/a/5932203/1046413
   */
  var relativeMouseCoordinates = function(event) {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = event.target;

    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    } while(currentElement = currentElement.offsetParent);

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {
      x:canvasX, 
      y:canvasY
    }
  };

  /**
   * given red, green, blue values, return the equivalent hexidecimal value
   * base source: http://stackoverflow.com/a/5624139/1046413
   */
  var componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  var rgbToHex = function(color) {
    return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
  };

  /**
   * directive link method
   */
  var linker = function(scope, element, attrs, ngModel) {   

    //scope defaults
    scope.width = attrs.width || 300;
    scope.height = attrs.height || 300;

    //create the picker and add to dom
    var picker = createPicker(scope.width, scope.height);      
    scope.canvasContext = picker.context;
    scope.canvas = element.append($compile(picker.canvas)(scope));

    //determine which color user selects
    scope.userPick = function(e) {
      var coords = relativeMouseCoordinates(e);
      var data = scope.canvasContext.getImageData(coords.x, coords.y, 1, 1).data;
      var rgb = {
          r: data[0],
          g: data[1],
          b: data[2]
      };
      var color = {
        hex: rgbToHex(rgb),
        rgb: rgb
      };

      ngModel.$setViewValue(color);
    }
  };  

  return {
    restrict: 'E',
    template: '<div class="simpleColorPicker" ng-click="userPick($event)"></div>',
    replace: true,
    require: '?ngModel',
    scope: {},
    link: linker
  }
}]);
