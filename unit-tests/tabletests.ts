///<reference path="../typings/jasmine/jasmine.d.ts"/>
///<reference path="../app/js/lifetable.ts"/>

function match(table : LifeTable.LifeTable, target : boolean[][]) : void
{
    expect(table.getRows()).toBe(target.length);
    expect(table.getCols()).toBe(target[0].length);

    for (var i = 0; i < table.getRows(); i++)
        for (var j = 0; j < table.getCols(); j++)
            expect(table.getElementAt(i, j)).toBe(target[i][j]);
}

describe('table tests', () =>
{
    var tables = [{name: 'LifeTable', func: LifeTable.LifeTable},
        {name: 'LifeTableToroidal', func: LifeTable.LifeTableToroidal}];

    tables.forEach((data) =>
    {
        var TableClass = data.func;

        describe(data.name + ' tests', () =>
        {
            var table : LifeTable.LifeTable;

            it('should create empty table', () =>
            {
                table = new TableClass(3, 3);

                expect(table.getRows()).toBe(3);
                expect(table.getCols()).toBe(3);
                for (var i = 0; i < 3; i++)
                    for (var j = 0; j < 3; j++)
                        expect(table.getElementAt(i, j)).toBe(false);
            });

            it('should set values correctly', () =>
            {
                table = new TableClass(3, 3);

                expect(table.getElementAt(0, 0)).toBe(false);
                table.setElementAt(0, 0, true);
                expect(table.getElementAt(0, 0)).toBe(true);
                table.setElementAt(0, 0, false);
                expect(table.getElementAt(0, 0)).toBe(false);
            });

            it('should advance correctly a block', () =>
            {
                table = new TableClass(4, 4);
                table.setElementAt(1, 1, true);
                table.setElementAt(1, 2, true);
                table.setElementAt(2, 1, true);
                table.setElementAt(2, 2, true);

                table.advance();

                var target = [[false, false, false, false],
                    [false, true, true, false],
                    [false, true, true, false],
                    [false, false, false, false]];

                match(table, target);
            });

            it('should advance correctly a blinker', () =>
            {
                table = new TableClass(5, 5);
                table.setElementAt(2, 1, true);
                table.setElementAt(2, 2, true);
                table.setElementAt(2, 3, true);

                table.advance();

                var target = [
                    [false, false, false, false, false],
                    [false, false, true, false, false],
                    [false, false, true, false, false],
                    [false, false, true, false, false],
                    [false, false, false, false, false]];

                match(table, target);
                table.advance();

                target = [
                    [false, false, false, false, false],
                    [false, false, false, false, false],
                    [false, true, true, true, false],
                    [false, false, false, false, false],
                    [false, false, false, false, false]];

                match(table, target);
            });

            it('should advance correctly a glider after 4 iterations', () =>
            {
                table = new TableClass(5, 5);
                table.setElementAt(0, 1, true);
                table.setElementAt(1, 2, true);
                table.setElementAt(2, 0, true);
                table.setElementAt(2, 1, true);
                table.setElementAt(2, 2, true);

                table.advance();
                table.advance();
                table.advance();
                table.advance();

                var target = [
                    [false, false, false, false, false],
                    [false, false, true, false, false],
                    [false, false, false, true, false],
                    [false, true, true, true, false],
                    [false, false, false, false, false]];

                match(table, target);
            });
        });
    });
});