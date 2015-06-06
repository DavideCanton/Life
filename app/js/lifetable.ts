module LifeTable
{
    function newTable(r : number, c : number) : boolean[][]
    {
        var table : boolean[][] = [];
        for (var i = 0; i < r; i++)
        {
            var row : boolean[] = [];
            for (var j = 0; j < c; j++)
                row.push(false);
            table.push(row);
        }
        return table;
    }

    export class LifeTable
    {
        private table : boolean[][];

        constructor(private r : number, private c : number)
        {
            this.table = newTable(r, c);
        }

        getElementAt(i : number, j : number) : boolean
        {
            return this.table[i][j];
        }

        setElementAt(i : number, j : number, val : boolean) : boolean
        {
            var old : boolean = this.getElementAt(i, j);
            this.table[i][j] = val;
            return old;
        }

        getRows() : number
        {
            return this.r;
        }

        getCols() : number
        {
            return this.c;
        }

        advance() : void
        {
            var table2 : boolean[][] = newTable(this.r, this.c);

            for (var i = 0; i < this.r; i++)
                for (var j = 0; j < this.c; j++)
                {
                    var n : number = this.computeNeighbors(i, j);
                    if (this.alive(i, j, n))
                        table2[i][j] = true;
                }
            this.table = table2;
        }

        protected computeNeighbors(r : number, c : number) : number
        {
            var n : number = 0;
            for (var i = r - 1; i <= r + 1; i++)
                for (var j = c - 1; j <= c + 1; j++)
                {
                    if (i == r && j == c)
                        continue;
                    if (i < 0 || j < 0 || i >= this.r || j >= this.c)
                        continue;
                    if (this.table[i][j])
                        n++;
                }
            return n;
        }

        private alive(i : number, j : number, n : number) : boolean
        {
            var val = this.table[i][j];
            return n == 3 || (n == 2 && val);
        }
    }

    export class LifeTableToroidal extends LifeTable
    {
        constructor(r : number, c : number)
        {
            super(r, c);
        }

        protected computeNeighbors(r : number, c : number) : number
        {
            var rows : number = this.getRows(), cols : number = this.getCols();

            var n : number = 0;
            for (var i = r - 1; i <= r + 1; i++)
                for (var j = c - 1; j <= c + 1; j++)
                {
                    if (i == r && j == c)
                        continue;

                    var actual_i : number = LifeTableToroidal.shift(i, rows);
                    var actual_j : number = LifeTableToroidal.shift(j, cols);

                    if (this.getElementAt(actual_i, actual_j))
                        n++;
                }
            return n;
        }

        private static shift(n : number, step : number) : number
        {
            if (n < 0) return n + step;
            if (n >= step) return n - step;
            return n;
        }
    }
}