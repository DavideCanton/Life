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
        constructor(public width : number, public value : boolean = true)
        {
        }

        incr() : void
        {
            this.width++;
        }

        decr() : void
        {
            if (this.width > 1)
                this.width--;
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
                    table.setElementAt(i, j, this.value);
        }
    }

    class RubberBrush extends PencilBrush
    {
        constructor(public width : number = 1)
        {
            super(width, false);
        }
    }

    class BlockBrush extends PencilBrush
    {
        constructor()
        {
            super(2);
        }
    }

    class ReverserBrush extends PencilBrush
    {
        constructor()
        {
            super(2);
        }

        applyTo(r : number, c : number, table : LifeTable.LifeTable)
        {
            for (var i = r; i < r + this.width; i++)
                for (var j = c; j < c + this.width; j++)
                    table.setElementAt(i, j, !table.getElementAt(i, j));
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

    class NoneBrush implements Brush
    {
        rows() : number
        {
            return 0;
        }

        cols() : number
        {
            return 0;
        }

        applyTo(i : number, j : number, table : LifeTable.LifeTable)
        {
        }
    }

    export interface BrushData
    {
        brush : Brushes.Brush;
        numconfig?: boolean;
        name: () => string;
    }

    export var BRUSHES : BrushData[] = [
        {
            name: () => 'None',
            brush: new NoneBrush()
        },

        {
            brush: new BlockBrush(),
            numconfig: true,
            name: function ()
            {
                if (this.brush.width === 1)
                    return "Pencil";
                else
                    return "Block " + this.brush.width + "x" + this.brush.width;
            }
        },

        {
            brush: new RubberBrush(1),
            numconfig: true,
            name: function ()
            {
                if (this.brush.width !== 1)
                    return "Rubber " + this.brush.width + "x" + this.brush.width;
                else
                    return "Rubber";
            }
        },

        {
            brush: new ReverserBrush(),
            numconfig: true,
            name: function ()
            {
                if (this.brush.width === 1)
                    return "Reverser";
                else
                    return "Reverser " + this.brush.width + "x" + this.brush.width;
            }
        },

        {
            name: () => 'Glider',
            brush: new GliderBrush()
        }
    ];
}