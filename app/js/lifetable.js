var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LifeTable;
(function (_LifeTable) {
    function newTable(r, c) {
        var table = [];
        for (var i = 0; i < r; i++) {
            var row = [];
            for (var j = 0; j < c; j++)
                row.push(false);
            table.push(row);
        }
        return table;
    }
    var LifeTable = (function () {
        function LifeTable(r, c, b, s) {
            this.r = r;
            this.c = c;
            this.b = b;
            this.s = s;
            this.table = newTable(r, c);
        }
        LifeTable.prototype.getElementAt = function (i, j) {
            return this.table[i][j];
        };
        LifeTable.prototype.setElementAt = function (i, j, val) {
            var old = this.getElementAt(i, j);
            this.table[i][j] = val;
            return old;
        };
        LifeTable.prototype.getRows = function () {
            return this.r;
        };
        LifeTable.prototype.getCols = function () {
            return this.c;
        };
        LifeTable.prototype.advance = function () {
            var table2 = newTable(this.r, this.c);
            for (var i = 0; i < this.r; i++)
                for (var j = 0; j < this.c; j++) {
                    var n = this.computeNeighbors(i, j);
                    if (this.alive(i, j, n))
                        table2[i][j] = true;
                }
            this.table = table2;
        };
        LifeTable.prototype.computeNeighbors = function (r, c) {
            var n = 0;
            for (var i = r - 1; i <= r + 1; i++)
                for (var j = c - 1; j <= c + 1; j++) {
                    if (i == r && j == c)
                        continue;
                    if (i < 0 || j < 0 || i >= this.r || j >= this.c)
                        continue;
                    if (this.table[i][j])
                        n++;
                }
            return n;
        };
        LifeTable.prototype.alive = function (i, j, n) {
            if (this.table[i][j])
                return this.s.indexOf(n) >= 0;
            return this.b.indexOf(n) >= 0;
        };
        return LifeTable;
    })();
    _LifeTable.LifeTable = LifeTable;
    var LifeTableToroidal = (function (_super) {
        __extends(LifeTableToroidal, _super);
        function LifeTableToroidal(r, c, b, s) {
            _super.call(this, r, c, b, s);
        }
        LifeTableToroidal.prototype.computeNeighbors = function (r, c) {
            var rows = this.getRows(), cols = this.getCols();
            var n = 0;
            for (var i = r - 1; i <= r + 1; i++)
                for (var j = c - 1; j <= c + 1; j++) {
                    if (i == r && j == c)
                        continue;
                    var actual_i = LifeTableToroidal.shift(i, rows);
                    var actual_j = LifeTableToroidal.shift(j, cols);
                    if (this.getElementAt(actual_i, actual_j))
                        n++;
                }
            return n;
        };
        LifeTableToroidal.shift = function (n, step) {
            if (n < 0)
                return n + step;
            if (n >= step)
                return n - step;
            return n;
        };
        return LifeTableToroidal;
    })(LifeTable);
    _LifeTable.LifeTableToroidal = LifeTableToroidal;
})(LifeTable || (LifeTable = {}));
//# sourceMappingURL=lifetable.js.map