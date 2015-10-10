///<reference path="lifetable.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Brushes;
(function (Brushes) {
    var PatternBrush = (function () {
        function PatternBrush(pattern) {
            this.pattern = pattern;
            this._rows = pattern.length;
            this._cols = (pattern[0] && pattern[0].length) || 0;
        }
        PatternBrush.prototype.rows = function () {
            return this._rows;
        };
        PatternBrush.prototype.cols = function () {
            return this._cols;
        };
        PatternBrush.prototype.applyTo = function (r, c, table) {
            for (var i = r; i < r + this._rows; i++)
                for (var j = c; j < c + this._cols; j++)
                    if (this.pattern[i - r][j - c])
                        table.setElementAt(i, j, true);
        };
        return PatternBrush;
    })();
    var PencilBrush = (function () {
        function PencilBrush(width, value) {
            if (value === void 0) { value = true; }
            this.width = width;
            this.value = value;
        }
        PencilBrush.prototype.incr = function () {
            this.width++;
        };
        PencilBrush.prototype.decr = function () {
            if (this.width > 1)
                this.width--;
        };
        PencilBrush.prototype.rows = function () {
            return this.width;
        };
        PencilBrush.prototype.cols = function () {
            return this.width;
        };
        PencilBrush.prototype.applyTo = function (r, c, table) {
            for (var i = r; i < r + this.width; i++)
                for (var j = c; j < c + this.width; j++)
                    table.setElementAt(i, j, this.value);
        };
        return PencilBrush;
    })();
    var RubberBrush = (function (_super) {
        __extends(RubberBrush, _super);
        function RubberBrush(width) {
            if (width === void 0) { width = 1; }
            _super.call(this, width, false);
            this.width = width;
        }
        return RubberBrush;
    })(PencilBrush);
    var BlockBrush = (function (_super) {
        __extends(BlockBrush, _super);
        function BlockBrush() {
            _super.call(this, 2);
        }
        return BlockBrush;
    })(PencilBrush);
    var ReverserBrush = (function (_super) {
        __extends(ReverserBrush, _super);
        function ReverserBrush() {
            _super.call(this, 2);
        }
        ReverserBrush.prototype.applyTo = function (r, c, table) {
            for (var i = r; i < r + this.width; i++)
                for (var j = c; j < c + this.width; j++)
                    table.setElementAt(i, j, !table.getElementAt(i, j));
        };
        return ReverserBrush;
    })(PencilBrush);
    var GliderBrush = (function (_super) {
        __extends(GliderBrush, _super);
        function GliderBrush() {
            var pattern = [[false, true, false], [false, false, true], [true, true, true]];
            _super.call(this, pattern);
        }
        return GliderBrush;
    })(PatternBrush);
    var NoneBrush = (function () {
        function NoneBrush() {
        }
        NoneBrush.prototype.rows = function () {
            return 0;
        };
        NoneBrush.prototype.cols = function () {
            return 0;
        };
        NoneBrush.prototype.applyTo = function (i, j, table) {
        };
        return NoneBrush;
    })();
    Brushes.BRUSHES = [
        {
            name: function () { return 'None'; },
            brush: new NoneBrush()
        },
        {
            brush: new BlockBrush(),
            numconfig: true,
            name: function () {
                if (this.brush.width === 1)
                    return "Pencil";
                else
                    return "Block " + this.brush.width + "x" + this.brush.width;
            }
        },
        {
            brush: new RubberBrush(1),
            numconfig: true,
            name: function () {
                if (this.brush.width !== 1)
                    return "Rubber " + this.brush.width + "x" + this.brush.width;
                else
                    return "Rubber";
            }
        },
        {
            brush: new ReverserBrush(),
            numconfig: true,
            name: function () {
                if (this.brush.width === 1)
                    return "Reverser";
                else
                    return "Reverser " + this.brush.width + "x" + this.brush.width;
            }
        },
        {
            name: function () { return 'Glider'; },
            brush: new GliderBrush()
        }
    ];
})(Brushes || (Brushes = {}));
//# sourceMappingURL=brushes.js.map