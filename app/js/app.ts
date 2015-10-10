///<reference path="../../typings/angularjs/angular.d.ts"/>
///<reference path="lifetable.ts"/>
///<reference path="brushes.ts"/>

var app : ng.IModule = angular.module("lifeApp", ['ngAnimate']);

interface MyScope extends ng.IScope
{
    table : LifeTable.LifeTable;
    current_brush : Brushes.Brush;
    r : number;
    c : number;
    b : boolean[];
    s : boolean[];
    generation : number;
    isRunning : boolean;
    toroidal : boolean;
    delay : number;
    fgcolor : string;
    bgcolor : string;
    timer : ng.IPromise<any>;
    brushes : Brushes.BrushData[];

    start() : void;
    stop() : void;
    step() : void;
    generate() : void;
    generate_random() : void;
    toggleToroidal() : void;
    range(a : number, b : number) : number[];
    applyBrush(i : number, j : number) : void;
    select(brushdata : Brushes.BrushData) : void;
    handleKeyPress($event : any) : void;
    setLife() : void;
    setHighLife() : void;
}

function toIntegerArray(b : boolean[]) : number[]
{
    var r = [];
    for (var i = 0; i < b.length; i++)
        if (b[i])
            r.push(i);
    return r;
}

function fromIntegerArray(n : number[]) : boolean[]
{
    var r = [false, false, false, false, false, false, false, false];
    for (var i = 0; i < n.length; i++)
        r[n[i]] = true;
    return r;
}

class LifeController
{
    static $inject : string[] = ['$scope', '$timeout'];

    constructor(private $scope : MyScope,
                private $timeout : ng.ITimeoutService)
    {
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

        $scope.$watch("timer", val =>
        {
            $scope.isRunning = !!val;
        });

        $scope.stop = () =>
        {
            if ($scope.timer)
            {
                $timeout.cancel($scope.timer);
                $scope.timer = null;
            }
        };

        $scope.generate = () =>
        {
            $scope.generation = 0;
            $scope.stop();
            var b = toIntegerArray($scope.b);
            var s = toIntegerArray($scope.s);

            if ($scope.toroidal)
                $scope.table = new LifeTable.LifeTableToroidal($scope.r, $scope.c, b, s);
            else
                $scope.table = new LifeTable.LifeTable($scope.r, $scope.c, b, s);
        };

        $scope.generate_random = () =>
        {
            $scope.generate();
            for (var i = 0; i < $scope.r; i++)
                for (var j = 0; j < $scope.c; j++)
                    if (Math.random() <= 0.5)
                        $scope.table.setElementAt(i, j, true);
        };

        $scope.range = (a : number, b : number) : number[] =>
        {
            var r : number[] = [];
            for (var i = a; i < b; i++)
                r.push(i);
            return r;
        };

        $scope.start = () =>
        {
            $scope.stop();

            var makeStep = () : void =>
            {
                $scope.generation++;
                $scope.table.advance();
                $scope.timer = $timeout(makeStep, $scope.delay);
            };

            $scope.timer = $timeout(makeStep, $scope.delay);
        };

        $scope.applyBrush = (i : number, j : number) : void =>
        {
            if ($scope.current_brush)
                $scope.current_brush.applyTo(i, j, $scope.table);
        };


        $scope.toggleToroidal = () =>
        {
            $scope.toroidal = !$scope.toroidal;
        };

        $scope.step = () =>
        {
            $scope.stop();
            $scope.table.advance();
            $scope.generation++;
        };

        $scope.handleKeyPress = ($event : any) : void =>
        {
            if ($event.which >= 49 && $event.which <= 57) // is a digit
            {
                var index : number = $event.which - 49;
                if (index < $scope.brushes.length)
                    $scope.select($scope.brushes[index]);
                return;
            }

            switch ($event.which)
            {
                case 32: // space
                    $scope.step();
                    break;
                case 13: // enter
                    if ($scope.isRunning)
                        $scope.stop();
                    else
                        $scope.start();
                    break;
                case 43: // plus
                    $scope.delay += 100;
                    break;
                case 45: // minus
                    $scope.delay -= 100;
                    if ($scope.delay < 0)
                        $scope.delay = 0;
                    break;
                case 103: // g
                    $scope.generate();
                    break;
                case 114: // r
                    $scope.generate_random();
                    break;
            }
        };

        $scope.select = (data : Brushes.BrushData) =>
        {
            $scope.current_brush = data.brush;
        };

        $scope.setLife = () =>
        {
            $scope.b = fromIntegerArray([3]);
            $scope.s = fromIntegerArray([2, 3]);
        };

        $scope.setHighLife = () =>
        {
            $scope.b = fromIntegerArray([3, 6]);
            $scope.s = fromIntegerArray([2, 3]);
        };

        $scope.setLife();
        $scope.generate();
    }
}

app.controller('lifeController', LifeController);

app.directive("adjustWidth", () =>
{
    return <ng.IDirective> {
        restrict: 'A',
        link: (scope : MyScope, element : ng.IAugmentedJQuery) =>
        {
            scope.$watch(() => scope.table.getCols(), colNum =>
            {
                var width = $(element).closest("table").parent().width();
                var cellSize = Math.min(width / colNum, 50) >> 0;

                element.css(
                    {
                        width: cellSize + "px",
                        height: cellSize + "px"
                    });
            });
        }
    };
});

app.directive("hoverBrush", () =>
{
    return {
        restrict: 'A',
        link: (scope : any, element : ng.IAugmentedJQuery) =>
        {
            var main_table = $("#main-table");
            var last_i = -1, last_j = -1;

            function onmouseover()
            {
                var s_i : number = scope.i;
                var s_j : number = scope.j;
                last_i = s_i;
                last_j = s_j;
                var cur_brush : Brushes.Brush = scope.current_brush;
                var r = cur_brush.rows();
                var c = cur_brush.cols();

                for (var i = s_i; i < s_i + r; i++)
                    for (var j = s_j; j < s_j + c; j++)
                    {
                        var row = main_table.find("tr").eq(i);
                        if (row.length == 0) continue;
                        var cell = row.find("td").eq(j);
                        if (cell.length == 0) continue;

                        cell.removeClass("top-hover bottom-hover left-hover right-hover");
                        if (i == s_i) cell.addClass("top-hover");
                        if (i == s_i + r - 1) cell.addClass("bottom-hover");
                        if (j == s_j) cell.addClass("left-hover");
                        if (j == s_j + c - 1) cell.addClass("right-hover");
                    }
            }

            function onmouseout()
            {
                var s_i = last_i;
                var s_j = last_j;
                var cur_brush : Brushes.Brush = scope.current_brush;
                var r = cur_brush.rows();
                var c = cur_brush.cols();

                for (var i = s_i; i < s_i + r; i++)
                    for (var j = s_j; j < s_j + c; j++)
                    {
                        var row = main_table.find("tr").eq(i);
                        if (row.length == 0) continue;
                        var cell = row.find("td").eq(j);
                        if (cell.length == 0) continue;

                        cell.removeClass("top-hover bottom-hover left-hover right-hover");
                    }
            }


            element.bind('mouseover', onmouseover);
            element.bind('mouseout', onmouseout);
        }
    }
});

app.directive("clickableCell", ()=>
{
    return {
        restrict: 'A',
        link: (scope : any, element : ng.IAugmentedJQuery) =>
        {
            var table = $("#main-table");

            scope.$on("$destroy", () =>
            {
                mouseup();
            });

            function mouseover(event : JQueryMouseEventObject)
            {
                if (event.which == 1)
                {
                    // get the scope of the hovered element, it has i and j
                    // thanks to prototypal inheritance
                    var elScope : any = angular.element(this).scope();
                    scope.$apply(() => scope.applyBrush(elScope.i, elScope.j));
                }
            }

            function mouseup()
            {
                table.off('mouseover', 'td', mouseover);
                table.off('mouseup', 'td', mouseup);
            }

            element.bind('mousedown', () =>
            {
                scope.$apply(() => scope.applyBrush(scope.i, scope.j));
                table.on('mouseover', 'td', mouseover);
                table.on('mouseup', 'td', mouseup);
            });

            scope.$watch(() => scope.table.getElementAt(scope.i, scope.j), val =>
            {
                element.css('background-color', val ? scope.fgcolor : scope.bgcolor);
            });

            scope.$watch("fgcolor", val =>
            {
                if (scope.table.getElementAt(scope.i, scope.j))
                    element.css('background-color', val);
            });

            scope.$watch("bgcolor", val =>
            {
                if (!scope.table.getElementAt(scope.i, scope.j))
                    element.css('background-color', val);
            });
        }
    };
});

app.directive("mycheckbox", () =>
{
    return <ng.IDirective> {
        restrict: 'E',
        scope: {
            model: "=",
            content: "="
        },
        link: (scope : any, element : ng.IAugmentedJQuery) =>
        {
            scope.$watch("content", value =>
            {
                element.find("button").text(value);
            });

            scope.$watch("model", value =>
            {
                var add : string = value ? "success" : "danger";
                var rem : string = add === "success" ? "danger" : "success";
                element.find("button").addClass("btn-" + add).removeClass("btn-" + rem);
            });

            element.bind('click', () =>
            {
                scope.$apply(() => scope.model = !scope.model)
            });
        },
        template: "<button class='btn no-rounded-border'></button>"
    };
});

app.directive("brushButton", () =>
{
    return {
        restrict: 'E',
        scope: {
            brush: "=",
            outerCurrentBrush: "=",
            onclick: "&"
        },
        template: '<div class="brush-btn-container"><button class="brush-btn btn btn-primary btn-block"> {{ brush.name() }}</button></div>',
        link: (scope : any, element : ng.IAugmentedJQuery) =>
        {
            var templateRoot = element.find("div:first-child");
            var brushButton = templateRoot.find(".brush-btn");

            scope.$watch(() => scope.outerCurrentBrush, value =>
            {
                brushButton.toggleClass("btn-danger", value === scope.brush.brush);
            });

            brushButton.bind("click", () =>
            {
                scope.$apply(() => scope.onclick());
            });

            if (scope.brush.numconfig)
            {
                var btnPlus = $('<button class="btn btn-success top-right-button">&plus;</button>');
                btnPlus.bind("click", () => scope.brush.brush.incr());

                var btnMinus = $('<button class="btn btn-warning bottom-right-button">&minus;</button>');
                btnMinus.bind("click", () => scope.brush.brush.decr());

                templateRoot.append(btnPlus).append(btnMinus);
            }
        }
    };
});

app.directive("sidebars", () =>
{
    return <ng.IDirective> {
        restrict: 'E',
        scope: {},
        transclude: true,
        templateUrl: "bars-template.html",
        controller: ['$scope', function ($scope)
        {
            var bars = $scope.bars = [];

            $scope.select = (bar) =>
            {
                this.closeAll();
                bar.selected = true;
            };

            this.addBar = (bar) =>
            {
                bar.selected = false;
                bars.push(bar);
            };

            this.closeAll = () =>
            {
                angular.forEach(bars, (bar) => bar.selected = false);
            }
        }]
    };
});

app.directive("sidebar", () =>
{
    return <ng.IDirective>{
        restrict: 'E',
        require: '^sidebars',
        transclude: true,
        scope: {
            title: '@'
        },
        link: function (scope : any, element, attrs, barsCtrl)
        {
            barsCtrl.addBar(scope);

            element.find(".closebtn").bind("click", () =>
            {
                scope.$apply(() => barsCtrl.closeAll());
            });
        },
        templateUrl: 'bar.html'
    }
});