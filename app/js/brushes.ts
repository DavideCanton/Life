///<reference path="lifetable.ts"/>

module Brushes
{
    export interface Brush
    {
        rows() : number;
        cols() : number;
        applyTo(i : number, j : number, table : LifeTable.LifeTable);
    }

    class PatternBrush implements Brush
    {
        private _rows : number;
        private _cols : number;

        constructor(private pattern : boolean[][])
        {
            this._rows = pattern.length;
            this._cols = (pattern[0] && pattern[0].length) || 0;
        }

        rows() : number
        {
            return this._rows;
        }

        cols() : number
        {
            return this._cols;
        }

        applyTo(r : number, c : number, table : LifeTable.LifeTable)
        {
            for (var i = r; i < r + this._rows; i++)
                for (var j = c; j < c + this._cols; j++)
                    if (this.pattern[i - r][j - c])
                        table.setElementAt(i, j, true);
        }
    }

    class PencilBrush implements Brush
    {
        constructor(private width : number)
        {
        }

        rows() : number
        {
            return this.width;
        }

        cols() : number
        {
            return this.width;
        }

        applyTo(r : number, c : number, table : LifeTable.LifeTable)
        {
            for (var i = r; i < r + this.width; i++)
                for (var j = c; j < c + this.width; j++)
                    table.setElementAt(i, j, true);
        }
    }

    class RubberBrush implements Brush
    {
        constructor(private width : number)
        {
        }

        rows() : number
        {
            return this.width;
        }

        cols() : number
        {
            return this.width;
        }

        applyTo(r : number, c : number, table : LifeTable.LifeTable)
        {
            for (var i = r; i < r + this.width; i++)
                for (var j = c; j < c + this.width; j++)
                    table.setElementAt(i, j, false);
        }
    }

    class BlockBrush extends PencilBrush
    {
        constructor()
        {
            super(2);
        }
    }

    class GliderBrush extends PatternBrush
    {
        constructor()
        {
            var pattern : boolean[][] = [[false, true, false], [false, false, true], [true, true, true]];
            super(pattern);
        }
    }

    export interface BrushData
    {
        name : string;
        brush : Brushes.Brush
    }

    export var BRUSHES : BrushData[] = [
        {name: 'pencil', brush: new PencilBrush(1)},
        {name: 'rubber', brush: new RubberBrush(1)},
        {name: 'block', brush: new BlockBrush()},
        {name: 'glider', brush: new GliderBrush()}];
}