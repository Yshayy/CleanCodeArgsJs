describe("No schema", function()
{
    var parse = Args.create({});
    it("should pass", function()
    {
        expect(function(){ parse("")}).not.to.toThrow();
    });
    it("should reject unknown flags", function()
    {
        expect(function(){ parse("-d")}).to.toThrow();
    });
});

describe("With one boolean flag", function()
{
    var parse = Args.create({boolean: "f"});
    it("flag should be false if absent", function()
    {
        expect(parse("")["f"]).not.toBe(false);
    });

    it("should be true if present", function()
    {
        expect(parse("-f")["f"]).toBe(true);
    })
});

describe("With several boolean arguments", function()
{
    var parse = Args.create({boolean: "f,g,h"});
    it("should report f as false if not present among many arguments", function()
    {
        expect(parse("-g -h")["f"]).not.toBe(true);
    });

    it("should report f as true if present among others", function()
    {
        expect(parse("-g -h -f ")["f"]).toBe(true);
    })

    it ("should be invalid if unexpected arguments are present", function()
    {
        expect(function(){ parse("-q")}).to.toThrow();
    })
});

describe("With one numeric argument", function()
{
    var parse = Args.create({number: "n"});
    it("should report n as 0 if absent", function()
    {
        expect(parse("")["n"]).toBe(0);
    });

    it("should report n as number if presented", function()
    {
        expect(parse("-n 23")["n"]).toBe(23);
    });
});

describe("With one string argument", function()
{
    var parse = Args.create({string: "s"});
    it("should s as empty string if absent", function()
    {
        expect(parse("")["s"]).toBe("");
    });

    it("should report s as string if presented", function()
    {
        expect(parse("-s bobby")["s"]).toBe("bobby");
    });
});

describe("With a complex schema", function()
{
    var parse = Args.create({
        boolean:"f,g",
        number:"n,m",
        string:"s,d"});

    it("Should have reasonable defaults for all", function()
    {
        var result = parse("");
        expect(result["f"]).toBe(false);
        expect(result["g"]).toBe(false);
        expect(result["n"]).toBe(0);
        expect(result["m"]).toBe(0);
        expect(result["s"]).toBe("");
        expect(result["d"]).toBe("");
    });

    it("should get all arguments", function()
    {
        var result = parse("-f -g -n 32 -m 48 -s bobby -d /home");
        expect(result["f"]).toBe(true);
        expect(result["g"]).toBe(true);
        expect(result["n"]).toBe(32);
        expect(result["m"]).toBe(48);
        expect(result["s"]).toBe("bobby");
        expect(result["d"]).toBe("/home");
    });

    it("should throw if undefined argument", function()
    {
        expect(function(){ parse("-q")}).to.toThrow();
    });
});

describe("With a single number-list element", function()
{
    var parse = Args.create({numberList: "l"});
    it("should report empty list if no argument", function()
    {
        expect(parse("")["l"]).toEqual([]);
    });

    it("should report s as string if presented", function()
    {
        expect(parse("-l 1,2,3,4")["l"]).toEqual([1,2,3,4]);
    });
});