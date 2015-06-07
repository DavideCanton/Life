///<reference path="../../typings/angularjs/angular.d.ts"/>
///<reference path="lifetable.ts"/>
///<reference path="brushes.ts"/>
var app = angular.module("lifeApp", []);
function toIntegerArray(b) {
    var r = [];
    for (var i = 0; i < b.length; i++)
        if (b[i])
            r.push(i);
    return r;
}
function fromIntegerArray(n) {
    var r = [false, false, false, false, false, false, false, false];
    for (var i = 0; i < n.length; i++)
        r[n[i]] = true;
    return r;
}
var LifeController = (function () {
    function LifeController($scope, $timeout) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        $scope.timer = null;
        $scope.delay = 1000;
        $scope.r = 10;
        $scope.c = 10;
        $scope.toroidal = true;
        $scope.isRunning = false;
        $scope.generation = 0;
        $scope.brushes = Brushes.BRUSHES;
        $scope.current_brush = $scope.brushes[0].brush;
        $scope.fgcolor = "#000000";
        $scope.bgcolor = "#ffffff";
        $scope.$watch("timer", function (val) {
            $scope.isRunning = !!val;
        });
        $scope.stop = function () {
            if ($scope.timer) {
                $timeout.cancel($scope.timer);
                $scope.timer = null;
            }
        };
        $scope.generate = function () {
            $scope.generation = 0;
            $scope.stop();
            var tableClass = $scope.toroidal ? LifeTable.LifeTableToroidal : LifeTable.LifeTable;
            var b = toIntegerArray($scope.b);
            var s = toIntegerArray($scope.s);
            $scope.table = new tableClass($scope.r, $scope.c, b, s);
        };
        $scope.generate_random = function () {
            $scope.generate();
            for (var i = 0; i < $scope.r; i++)
                for (var j = 0; j < $scope.c; j++)
                    if (Math.random() <= 0.5)
                        $scope.table.setElementAt(i, j, true);
        };
        $scope.range = function (a, b) {
            var r = [];
            for (var i = a; i < b; i++)
                r.push(i);
            return r;
        };
        $scope.start = function () {
            $scope.stop();
            var makeStep = function () {
                $scope.generation++;
                $scope.table.advance();
                $scope.timer = $timeout(makeStep, $scope.delay);
            };
            $scope.timer = $timeout(makeStep, $scope.delay);
        };
        $scope.applyBrush = function (i, j) {
            if ($scope.current_brush) {
                $scope.current_brush.applyTo(i, j, $scope.table);
            }
        };
        $scope.step = function () {
            $scope.stop();
            $scope.table.advance();
            $scope.generation++;
        };
        $scope.handleKeyPress = function ($event) {
            if ($event.which >= 49 && $event.which <= 57) {
                var index = $event.which - 49;
                if (index < $scope.brushes.length)
                    $scope.select($scope.brushes[index]);
                return;
            }
            switch ($event.which) {
                case 32:
                    $scope.step();
                    break;
                case 13:
                    if ($scope.isRunning)
                        $scope.stop();
                    else
                        $scope.start();
                    break;
                case 43:
                    $scope.delay += 100;
                    break;
                case 45:
                    $scope.delay -= 100;
                    if ($scope.delay < 0)
                        $scope.delay = 0;
                    break;
                case 103:
                    $scope.generate();
                    break;
                case 114:
                    $scope.generate_random();
                    break;
            }
        };
        $scope.select = function (data) {
            $scope.current_brush = data.brush;
        };
        $scope.setLife = function () {
            $scope.b = fromIntegerArray([3]);
            $scope.s = fromIntegerArray([2, 3]);
        };
        $scope.setHighLife = function () {
            $scope.b = fromIntegerArray([3, 6]);
            $scope.s = fromIntegerArray([2, 3]);
        };
        $scope.setLife();
        $scope.generate();
    }
    LifeController.$inject = ['$scope', '$timeout'];
    return LifeController;
})();
app.controller('lifeController', LifeController);
app.directive("adjustWidth", function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(function () { return scope.table.getRows(); }, function (val) {
                for (var i = 1; i <= 6; i++)
                    element.removeClass("cell-" + i);
                var value = Math.ceil(+val / 30);
                element.addClass("cell-" + Math.min(value, 6));
            });
        }
    };
});
app.directive("clickableCell", ['$parse', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attrs) {
            var compiledOnClick = $parse(attrs.onClick);
            var compiledOnMove = $parse(attrs.onMove);
            element.bind('click', function () {
                scope.$apply(function () { return compiledOnClick(scope, {}); });
            }).bind('mousemove', function (event) {
                if (event.which == 1)
                    scope.$apply(function () { return compiledOnMove(scope, {}); });
            });
            scope.$watch(function () { return scope.table.getElementAt(scope.i, scope.j); }, function (val) {
                if (val)
                    element.css('background-color', scope.fgcolor);
                else
                    element.css('background-color', scope.bgcolor);
            });
            scope.$watch("fgcolor", function (val) {
                if (scope.table.getElementAt(scope.i, scope.j))
                    element.css('background-color', val);
            });
            scope.$watch("bgcolor", function (val) {
                if (!scope.table.getElementAt(scope.i, scope.j))
                    element.css('background-color', val);
            });
        }
    };
}]);
function invert(color) {
    function toHex(v) {
        var s = v.toString(16);
        if (s.length == 1)
            s = '0' + s;
        return s;
    }
    var r = 255 - parseInt(color.substring(1, 3), 16);
    var g = 255 - parseInt(color.substring(3, 5), 16);
    var b = 255 - parseInt(color.substring(5, 7), 16);
    return '#' + toHex(r) + toHex(g) + toHex(b);
}
app.directive("invertBorder", function () {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attrs) {
            scope.$watch("bgcolor", function (val) {
                element.css("border-color", invert(val));
            });
        }
    };
});
//# sourceMappingURL=app.js.map