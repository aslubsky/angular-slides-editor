/**
 * angularSlidesEditor: Angular JS Slide editor
 *
 * @author Alex Slubsky <aslubsky@gmail.com>
 * @url https://github.com/aslubsky/angular-slides-editor/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc directive
 * @name angularSlidesEditor.directive:angularSlidesEditor
 * @restrict A
 *
 * @description
 *
 */


app.directive('angularSlidesEditor', ['$compile', '$q', '$parse',
    function ($compile, $q, $parse) {
        'use strict';

        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'angular-slides-editor/main.html',
            //controller: angularSlidesEditorController,
            link: function ($scope, element, attrs, ngModel) {
                var editorElement = angular.element(document.querySelector('.canvas-wrapper'));

                editorElement.on('click', function () {
                    if (document.activeElement && (
                        angular.isDefined(document.activeElement.attributes['slides-editor-object']) ||
                        (document.activeElement.hasAttribute('contenteditable') && document.activeElement.getAttribute('contenteditable') == 'true'))) {
                    } else {
                        $scope.$emit('objects.unselected');
                    }
                });


                $scope.loadSlide = function () {
                }


                /* controls for current slide */
                $scope._getObjectsCount = function () {
                    return angular.element(document.querySelectorAll("[slides-editor-object]")).length;
                }

                $scope.selectedObject = null;
                $scope.slideObjectsCount = $scope._getObjectsCount();
                $scope.hideInstruments = false;
                $scope.imageCtrl = false;
                $scope.textCtrl = false;


                $scope.textProperties = JSON.parse(window.localStorage.getItem('aseTextProperties'));
                if (!$scope.textProperties) {
                    $scope.textProperties = {
                        fontFamily: 'helvetica',
                        fontSize: '46px',
                        fill: '#000000',
                        backgroundColor: '',
                        lineHeight: '46px',
                        padding: 0,
                        fontWeight: '',
                        fontStyle: '',
                        textAlign: 'left',
                        textDecoration: ''
                    }
                }

                $scope._toPx = function (str) {
                    return str + 'px';
                }
                $scope._fromPx = function (str) {
                    return str.length > 0 ? parseInt(str.replace('px', ''), 0) : str;
                }
                $scope._componentToHex = function (c) {
                    var hex = c.toString(16);
                    return hex.length == 1 ? "0" + hex : hex;
                }
                $scope._fromRgb = function (str) {
                    if (angular.isUndefined(str) || str.length == 0) {
                        return '';
                    }
                    str = str.replace('rgb(', '');
                    str = str.replace(' ', '');
                    str = str.replace(')', '');
                    var parts = str.split(',');
                    return "#" + $scope._componentToHex(parseInt(parts[0], 10)) +
                        $scope._componentToHex(parseInt(parts[1], 10)) +
                        $scope._componentToHex(parseInt(parts[2], 10));
                }

                var textAttributes = {
                    'fontSize': {
                        convert: $scope._toPx,
                        parse: $scope._fromPx
                    },
                    'padding': {
                        convert: $scope._toPx,
                        parse: $scope._fromPx
                    },
                    'lineHeight': {
                        convert: $scope._toPx,
                        parse: $scope._fromPx
                    },
                    'fontStyle': {},
                    'fontWeight': {},
                    'textDecoration': {},
                    'textAlign': {},
                    'fontFamily': {},
                    'color': {
                        parse: $scope._fromRgb
                    },
                    'backgroundColor': {
                        parse: $scope._fromRgb
                    }
                };

                var textAttr = Object.keys(textAttributes);
                textAttr.forEach(function (attr) {
                    $scope.$watch(attr, function (nv, ov) {
                        if ($scope.selectedObject) {
                            console.log('textAttributes', attr, nv, ov);
                            $scope.selectedObject.css(attr,
                                angular.isDefined(textAttributes[attr].convert) ?
                                    textAttributes[attr].convert(nv) : nv);
                        }
                    });
                });
                $scope._parseTextAttributes = function () {
                    textAttr.forEach(function (attr) {
                        var val = $scope.selectedObject.css(attr);
                        if (!val) {
                            val = $scope.textProperties[attr];
                        }
                        $scope[attr] = angular.isDefined(textAttributes[attr].parse) ? textAttributes[attr].parse(val) : val;
                    });
                }
                $scope._parseImageAttributes = function () {
                    $scope.imageSrc = $scope.selectedObject.find('img').attr('src');
                }


                /* events */
                $scope.$on('objects.unselected', function (e, o) {
                    console.log('objects.unselected', e, o);

                    if ($scope.selectedObject && $scope.selectedObject.hasClass('edit')) {
                        $scope.selectedObject
                            .removeClass('edit')
                            .addClass('move');
                        $scope.selectedObject.find('editor').attr('contenteditable', 'false');
                    }


                    //$scope.selectedObject
                    //    .attr('contenteditable', 'false')
                    //    .removeClass('edit')
                    //    .addClass('move');
                    $scope.hideInstruments = false;
                    $scope.imageCtrl = false;
                    $scope.textCtrl = false;
                    $scope.selectedObject = null;

                    angular.element(document.getElementsByClassName('object')).removeClass('active');

                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
                $scope.$on('object.selected', function (e, o) {
                    $scope.selectedObject = angular.element(o);
                    $scope.hideInstruments = true;
                    $scope.imageCtrl = false;
                    $scope.textCtrl = false;
                    if ($scope.selectedObject.hasClass('edit')) {
                        $scope.textCtrl = true;
                        $scope._parseTextAttributes();
                    } else {
                        $scope.imageCtrl = true;
                        $scope._parseImageAttributes();
                    }
                    angular.element(document.getElementsByClassName('object')).removeClass('active');
                    $scope.selectedObject.addClass('active');
                    console.log('object.selected', e, o, $scope.selectedObject);

                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
                $scope.$on('object.edited', function (e, o) {
                    //$scope.selectedObject = angular.element(o);
                    console.log('object.edited', e, o);
                });


                /* controls for current slide */
                $scope._getRandomInt = function (max, min) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
                $scope._getRandomLeftTop = function () {
                    var offset = 50;
                    return {
                        left: $scope._getRandomInt(offset, 700 - offset),
                        top: $scope._getRandomInt(offset, 500 - offset)
                    };
                }
                $scope.duplicateCurrentObject = function () {
                    var cnt = ++$scope.slideObjectsCount;
                    var pos = $scope._getRandomLeftTop();

                    var newObject = angular.element($scope.selectedObject.clone());
                    newObject.attr('id', 'obj_' + cnt);
                    newObject.attr('tabindex', cnt);
                    newObject.css({
                        zIndex: cnt,
                        left: pos.left + 'px',
                        top: pos.top + 'px'
                    });
                    console.info('newObject', newObject.html(), pos, newObject);

                    editorElement.append($compile(newObject)($scope));
                    newObject[0].focus();
                    $scope.selectedObject = newObject;
                }
                $scope.removeCurrentObject = function () {
                    if ($scope.selectedObject) {
                        $scope.selectedObject.remove();
                    }
                    $scope.selectedObject = null;
                    $scope.$emit('objects.unselected');
                }
                $scope.addText = function () {
                    var cnt = ++$scope.slideObjectsCount;
                    var pos = $scope._getRandomLeftTop();
                    var text = 'Text';
                    var newObject = angular.element('<div id="obj_' + cnt + '" class="object edit" slides-editor-object>' +
                    '<div class="object-expand-point tl"></div>' +
                    '<div class="object-expand-point ml"></div>' +
                    '<div class="object-expand-point bl"></div>' +
                    '<div class="object-expand-point tc"></div>' +
                    '<div class="object-expand-point bc"></div>' +
                    '<div class="object-expand-point tr"></div>' +
                    '<div class="object-expand-point mr"></div>' +
                    '<div class="object-expand-point br"></div>' +
                    '<editor class="content" contenteditable="true">' +
                    text +
                    '</editor>' +
                    '</div>');
                    newObject.attr('tabindex', cnt);

                    textAttr.forEach(function (attr) {
                        newObject.css(attr, $scope.textProperties[attr]);
                    });

                    newObject.css({
                        zIndex: cnt,
                        width: '100px',
                        height: '46px',
                        left: pos.left + 'px',
                        top: pos.top + 'px'
                    });
                    //console.log(newObject.html());

                    editorElement.append($compile(newObject)($scope));
                    newObject[0].focus();
                    $scope.selectedObject = newObject;
                }
                $scope.addImage = function (imageSrc) {
                    var cnt = ++$scope.slideObjectsCount;
                    var pos = $scope._getRandomLeftTop();
                    var newObject = angular.element('<div id="obj_' + cnt + '" class="object move" slides-editor-object>' +
                    '<div class="object-expand-point tl"></div>' +
                    '<div class="object-expand-point ml"></div>' +
                    '<div class="object-expand-point bl"></div>' +
                    '<div class="object-expand-point tc"></div>' +
                    '<div class="object-expand-point bc"></div>' +
                    '<div class="object-expand-point tr"></div>' +
                    '<div class="object-expand-point mr"></div>' +
                    '<div class="object-expand-point br"></div>' +
                    '<img src="' + imageSrc + '">' +
                    '</div>');
                    newObject.attr('tabindex', cnt);

                    newObject.css({
                        zIndex: cnt,
                        width: '400px',
                        left: pos.left + 'px',
                        top: pos.top + 'px'
                    });
                    //console.log(newObject.html());

                    editorElement.append($compile(newObject)($scope));
                    newObject[0].focus();
                    $scope.selectedObject = newObject;
                }
                $scope.sendToBack = function () {
                }
                $scope.bringToFront = function () {
                }



                
                
            }
        }
    }
]);

app.directive('canvasBackground', ['$compile', '$q', '$parse',
    function ($compile, $q, $parse) {
        'use strict';

        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, element, attrs) {
                var el = element[0];
                console.log(element, el, el.getContext("2d"));

                $scope.gridSize = 75;
                $scope.highlightGridLeft = el.offsetWidthh + 10;
                $scope.highlightGridRight = $scope.highlightGridLeft;
                $scope.highlightGridTop = el.offsetHeight + 10;
                $scope.highlightGridBottom = $scope.highlightGridTop;

                $scope.$parent.$on('objects.unselected', function (e, o) {
                    console.log('$parent objects.unselected', e, o);
                });

                $scope.onObjectMoved = function (options) {
                    //console.log(options.target);
                    var left = options.target.left - options.target.padding;
                    var right = options.target.left + options.target.currentWidth + options.target.padding;
                    var top = options.target.top - options.target.padding;
                    var bottom = options.target.top + options.target.currentHeight + options.target.padding;

                    $scope.highlightGridLeft = Math.round(left / $scope.gridSize) * $scope.gridSize;
                    if (Math.abs($scope.highlightGridLeft - left) <= $scope.gridSize * 0.1) {
                        options.target.set({
                            left: $scope.highlightGridLeft + options.target.padding
                        });
                    } else {
                        $scope.highlightGridLeft = $scope.canvas.width + 10;
                    }

                    $scope.highlightGridRight = Math.round(right / $scope.gridSize) * $scope.gridSize;
                    if (Math.abs($scope.highlightGridRight - right) <= $scope.gridSize * 0.1) {
                        options.target.set({
                            left: $scope.highlightGridRight - options.target.currentWidth - options.target.padding
                        });
                    } else {
                        $scope.highlightGridRight = $scope.canvas.width + 10;
                    }

                    $scope.highlightGridTop = Math.round(top / $scope.gridSize) * $scope.gridSize;
                    if (Math.abs($scope.highlightGridTop - top) <= $scope.gridSize * 0.1) {
                        options.target.set({
                            top: $scope.highlightGridTop + options.target.padding
                        });
                    } else {
                        $scope.highlightGridTop = $scope.canvas.height + 10;
                    }

                    $scope.highlightGridBottom = Math.round(bottom / $scope.gridSize) * $scope.gridSize;
                    if (Math.abs($scope.highlightGridBottom - bottom) <= $scope.gridSize * 0.1) {
                        options.target.set({
                            top: $scope.highlightGridBottom - options.target.currentHeight - options.target.padding
                        });
                    } else {
                        $scope.highlightGridBottom = $scope.canvas.height + 10;
                    }
                }



                $scope._drawGrid = function () {
                    var ctx = el.getContext("2d");

                    var i = 0;
                    var wc = Math.ceil(el.offsetWidth / $scope.gridSize);
                    var hc = Math.ceil(el.offsetHeight / $scope.gridSize);

                    ctx.lineCap = 'butt';
                    ctx.lineJoin = 'miter';
                    ctx.strokeStyle = '#c0c0c0';
                    ctx.lineWidth = '0.5';

                    //console.log($scope.highlightGridLeft);
                    //console.log($scope.highlightGridTop);

                    for (; i < wc; i++) {
                        ctx.beginPath();
                        if ($scope.highlightGridLeft == i * $scope.gridSize || $scope.highlightGridRight == i * $scope.gridSize) {
                            ctx.strokeStyle = '#FFDC00';
                        } else {
                            ctx.strokeStyle = '#c0c0c0';
                        }
                        ctx.moveTo(i * $scope.gridSize - 0.5, 0);
                        ctx.lineTo(i * $scope.gridSize, el.offsetHeight);
                        ctx.closePath();
                        ctx.stroke();
                    }
                    for (i = 0; i < hc; i++) {
                        ctx.beginPath();
                        if ($scope.highlightGridTop == i * $scope.gridSize || $scope.highlightGridBottom == i * $scope.gridSize) {
                            ctx.strokeStyle = '#FFDC00';
                        } else {
                            ctx.strokeStyle = '#c0c0c0';
                        }
                        ctx.moveTo(0, i * $scope.gridSize);
                        ctx.lineTo(el.offsetWidth, i * $scope.gridSize);
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
                $scope._drawGrid();
            }
        };
    }
]);


app.directive('slidesEditorObject', ['$compile', '$q', '$parse',
    function ($compile, $q, $parse) {
        'use strict';

        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, element, attrs) {



                //console.info($scope, $scope.$parent);
                dragMaster.makeDraggable(element, document.querySelector('.canvas-wrapper'), $scope.$parent);


                //var clicks = 0;
                //element.on('click', function(){
                //    console.log('object click');
                //    clicks++;
                //    if (clicks == 1) {
                //        setTimeout(function() {
                //            if(clicks == 1) {
                //                console.log('single click!');
                //            } else {
                //                console.log('double click!');
                //            }
                //            clicks = 0;
                //        }, 300);
                //    }
                //});


                var savedRange;

                function saveSelection() {
                    if (window.getSelection)//non IE Browsers
                    {
                        savedRange = window.getSelection().getRangeAt(0);
                    }
                    else if (document.selection)//IE
                    {
                        savedRange = document.selection.createRange();
                    }
                }

                function restoreSelection() {
                    console.log('restore', savedRange);
                    if (savedRange != null) {
                        if (window.getSelection)//non IE and there is already a selection
                        {
                            var s = window.getSelection();
                            if (s.rangeCount > 0)
                                s.removeAllRanges();
                            s.addRange(savedRange);
                        }
                        else if (document.createRange)//non IE and no selection
                        {
                            window.getSelection().addRange(savedRange);
                        }
                        else if (document.selection)//IE
                        {
                            savedRange.select();
                        }
                    } else {
                        window.getSelection().addRange(document.createRange(0, 0));
                    }
                }

                /*
                 //this part onwards is only needed if you want to restore selection onclick
                 var isInFocus = false;

                 function onDivBlur() {
                 isInFocus = false;
                 //console.log('onDivBlur', isInFocus);
                 element
                 .attr('contenteditable', 'false')
                 .removeClass('edit')
                 .addClass('move');
                 }

                 function cancelEvent(e) {
                 if (isInFocus == false && savedRange != null) {
                 if (e && e.preventDefault) {
                 //alert("FF");
                 e.stopPropagation(); // DOM style (return false doesn't always work in FF)
                 e.preventDefault();
                 }
                 else {
                 window.event.cancelBubble = true;//IE stopPropagation
                 }
                 restoreSelection();
                 return false; // false = IE style
                 }
                 }

                 element.on('blur', onDivBlur);
                 //element.on('mousedown', cancelEvent);
                 //element.on('click', cancelEvent);
                 element.on('mouseup', saveSelection);
                 element.on('keyup', saveSelection);
                 //element.on('focus', restoreSelection);
                 */

                var isInFocus = false;
                element.on('blur', function () {
                    isInFocus = false;
                    console.log('blur isInFocus', isInFocus);
                    //    element.find('editor').attr('contenteditable', 'false');
                    //    element
                    //        .removeClass('edit')
                    //        .addClass('move');
                });

                var clicks = 0;
                element.on('click', function () {
                    clicks++;
                    if (clicks == 1) {
                        setTimeout(function () {
                            if (clicks == 1) {
                                //console.log('single click!');
                            } else {
                                console.log('double click!');
                                if (!isInFocus) {
                                    isInFocus = true;
                                    //console.log('EDIT!');
                                    element.find('editor').attr('contenteditable', 'true');
                                    element
                                        .removeClass('move')
                                        .addClass('edit');


                                    element.find('editor')[0].focus();
                                    element.find('editor')[0].click();

                                    console.log('editor', element.find('editor'), element.find('editor')[0]);
                                    restoreSelection();
                                }
                            }
                            clicks = 0;
                        }, 300);
                    }
                });
            }
        }
    }
]);