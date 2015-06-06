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
        function PencilBrush(width) {
            this.width = width;
        }
        PencilBrush.prototype.rows = function () {
            return this.width;
        };
        PencilBrush.prototype.cols = function () {
            return this.width;
        };
        PencilBrush.prototype.applyTo = function (r, c, table) {
            for (var i = r; i < r + this.width; i++)
                for (var j = c; j < c + this.width; j++)
                    table.setElementAt(i, j, true);
        };
        return PencilBrush;
    })();
    var RubberBrush = (function () {
        function RubberBrush(width) {
            this.width = width;
        }
        RubberBrush.prototype.rows = function () {
            return this.width;
        };
        RubberBrush.prototype.cols = function () {
            return this.width;
        };
        RubberBrush.prototype.applyTo = function (r, c, table) {
            for (var i = r; i < r + this.width; i++)
                for (var j = c; j < c + this.width; j++)
                    table.setElementAt(i, j, false);
        };
        return RubberBrush;
    })();
    var BlockBrush = (function (_super) {
        __extends(BlockBrush, _super);
        function BlockBrush() {
            _super.call(this, 2);
        }
        return BlockBrush;
    })(PencilBrush);
    var GliderBrush = (function (_super) {
        __extends(GliderBrush, _super);
        function GliderBrush() {
            var pattern = [[false, true, false], [false, false, true], [true, true, true]];
            _super.call(this, pattern);
        }
        return GliderBrush;
    })(PatternBrush);
    Brushes.BRUSHES = [
        { name: 'pencil', brush: new PencilBrush(1) },
        { name: 'rubber', brush: new RubberBrush(1) },
        { name: 'block', brush: new BlockBrush() },
        { name: 'glider', brush: new GliderBrush() }
    ];
})(Brushes || (Brushes = {}));
//# sourceMappingURL=brushes.js.map