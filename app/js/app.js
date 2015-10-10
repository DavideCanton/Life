///<reference path="../../typings/angularjs/angular.d.ts"/>
///<reference path="lifetable.ts"/>
///<reference path="brushes.ts"/>
var app = angular.module("lifeApp", ['ngAnimate']);
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
            var b = toIntegerArray($scope.b);
            var s = toIntegerArray($scope.s);
            if ($scope.toroidal)
                $scope.table = new LifeTable.LifeTableToroidal($scope.r, $scope.c, b, s);
            else
                $scope.table = new LifeTable.LifeTable($scope.r, $scope.c, b, s);
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
            if ($scope.current_brush)
                $scope.current_brush.applyTo(i, j, $scope.table);
        };
        $scope.toggleToroidal = function () {
            $scope.toroidal = !$scope.toroidal;
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
        link: function (scope, element) {
            scope.$watch(function () { return scope.table.getCols(); }, function (colNum) {
                var width = $(element).closest("table").parent().width();
                var cellSize = Math.min(width / colNum, 50) >> 0;
                element.css({
                    width: cellSize + "px",
                    height: cellSize + "px"
                });
            });
        }
    };
});
app.directive("hoverBrush", function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var main_table = $("#main-table");
            var last_i = -1, last_j = -1;
            function onmouseover() {
                var s_i = scope.i;
                var s_j = scope.j;
                last_i = s_i;
                last_j = s_j;
                var cur_brush = scope.current_brush;
                var r = cur_brush.rows();
                var c = cur_brush.cols();
                for (var i = s_i; i < s_i + r; i++)
                    for (var j = s_j; j < s_j + c; j++) {
                        var row = main_table.find("tr").eq(i);
                        if (row.length == 0)
                            continue;
                        var cell = row.find("td").eq(j);
                        if (cell.length == 0)
                            continue;
                        cell.removeClass("top-hover bottom-hover left-hover right-hover");
                        if (i == s_i)
                            cell.addClass("top-hover");
                        if (i == s_i + r - 1)
                            cell.addClass("bottom-hover");
                        if (j == s_j)
                            cell.addClass("left-hover");
                        if (j == s_j + c - 1)
                            cell.addClass("right-hover");
                    }
            }
            function onmouseout() {
                var s_i = last_i;
                var s_j = last_j;
                var cur_brush = scope.current_brush;
                var r = cur_brush.rows();
                var c = cur_brush.cols();
                for (var i = s_i; i < s_i + r; i++)
                    for (var j = s_j; j < s_j + c; j++) {
                        var row = main_table.find("tr").eq(i);
                        if (row.length == 0)
                            continue;
                        var cell = row.find("td").eq(j);
                        if (cell.length == 0)
                            continue;
                        cell.removeClass("top-hover bottom-hover left-hover right-hover");
                    }
            }
            element.bind('mouseover', onmouseover);
            element.bind('mouseout', onmouseout);
        }
    };
});
app.directive("clickableCell", function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var table = $("#main-table");
            scope.$on("$destroy", function () {
                mouseup();
            });
            function mouseover(event) {
                if (event.which == 1) {
                    // get the scope of the hovered element, it has i and j
                    // thanks to prototypal inheritance
                    var elScope = angular.element(this).scope();
                    scope.$apply(function () { return scope.applyBrush(elScope.i, elScope.j); });
                }
            }
            function mouseup() {
                table.off('mouseover', 'td', mouseover);
                table.off('mouseup', 'td', mouseup);
            }
            element.bind('mousedown', function () {
                scope.$apply(function () { return scope.applyBrush(scope.i, scope.j); });
                table.on('mouseover', 'td', mouseover);
                table.on('mouseup', 'td', mouseup);
            });
            scope.$watch(function () { return scope.table.getElementAt(scope.i, scope.j); }, function (val) {
                element.css('background-color', val ? scope.fgcolor : scope.bgcolor);
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
});
app.directive("mycheckbox", function () {
    return {
        restrict: 'E',
        scope: {
            model: "=",
            content: "="
        },
        link: function (scope, element) {
            scope.$watch("content", function (value) {
                element.find("button").text(value);
            });
            scope.$watch("model", function (value) {
                var add = value ? "success" : "danger";
                var rem = add === "success" ? "danger" : "success";
                element.find("button").addClass("btn-" + add).removeClass("btn-" + rem);
            });
            element.bind('click', function () {
                scope.$apply(function () { return scope.model = !scope.model; });
            });
        },
        template: "<button class='btn no-rounded-border'></button>"
    };
});
app.directive("brushButton", function () {
    return {
        restrict: 'E',
        scope: {
            brush: "=",
            outerCurrentBrush: "=",
            onclick: "&"
        },
        template: '<div class="brush-btn-container"><button class="brush-btn btn btn-primary btn-block"> {{ brush.name() }}</button></div>',
        link: function (scope, element) {
            var templateRoot = element.find("div:first-child");
            var brushButton = templateRoot.find(".brush-btn");
            scope.$watch(function () { return scope.outerCurrentBrush; }, function (value) {
                brushButton.toggleClass("btn-danger", value === scope.brush.brush);
            });
            brushButton.bind("click", function () {
                scope.$apply(function () { return scope.onclick(); });
            });
            if (scope.brush.numconfig) {
                var btnPlus = $('<button class="btn btn-success top-right-button">&plus;</button>');
                btnPlus.bind("click", function () { return scope.brush.brush.incr(); });
                var btnMinus = $('<button class="btn btn-warning bottom-right-button">&minus;</button>');
                btnMinus.bind("click", function () { return scope.brush.brush.decr(); });
                templateRoot.append(btnPlus).append(btnMinus);
            }
        }
    };
});
app.directive("sidebars", function () {
    return {
        restrict: 'E',
        scope: {},
        transclude: true,
        templateUrl: "bars-template.html",
        controller: ['$scope', function ($scope) {
            var _this = this;
            var bars = $scope.bars = [];
            $scope.select = function (bar) {
                _this.closeAll();
                bar.selected = true;
            };
            this.addBar = function (bar) {
                bar.selected = false;
                bars.push(bar);
            };
            this.closeAll = function () {
                angular.forEach(bars, function (bar) { return bar.selected = false; });
            };
        }]
    };
});
app.directive("sidebar", function () {
    return {
        restrict: 'E',
        require: '^sidebars',
        transclude: true,
        scope: {
            title: '@'
        },
        link: function (scope, element, attrs, barsCtrl) {
            barsCtrl.addBar(scope);
            element.find(".closebtn").bind("click", function () {
                scope.$apply(function () { return barsCtrl.closeAll(); });
            });
        },
        templateUrl: 'bar.html'
    };
});
//# sourceMappingURL=app.js.map