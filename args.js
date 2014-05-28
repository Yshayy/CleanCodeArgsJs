var Args = (function()
{
    function pipe(fn1, fn2){return function(){return fn2(fn1.apply(this,arguments))}}

    function shift(arr){return arr.shift();}

    var marshalers = {
        number: pipe(shift, parseFloat),
        string: shift,
        boolean: function(x) {return true;},
        numberList: pipe(shift, function(x){ return x.split(",").map(parseFloat)})
    }

    var defaults = {
        number:0,
        string:"",
        boolean: false,
        numberList: []
    };

    function isFlag(s){return s[0] === '-'}

    function flatParams(schema)
    {
        var params = {};
        Object.keys(schema).forEach(function(paramType){
            schema[paramType].split(',').forEach(function(ParamValue)
            {
                params[ParamValue] = paramType
            });
        });
        return params;
    }

    function createResultWithDefaults(params)
    {
        var result = {};
        Object.keys(params).map(function(paramKey){
                result[paramKey] = defaults[params[paramKey]];
            });
        return result;
    }

    return {
        create: function(schema)
        {
            var params = flatParams(schema || {});
            var resultPrototype = createResultWithDefaults(params);

            return function(args)
            {
                var argsArray = (args || "").split(" ");
                var result = Object.create(resultPrototype);

                while (argsArray.length > 0)
                {
                    var current= argsArray.shift();
                    if (!isFlag(current)) continue;
                    var flag = current.substr(1);
                    if (!params[flag])
                        throw "parameter is not defined";
                    var marshaler = marshalers[params[flag]];
                    if (!marshaler) {
                        throw "parameter type is not supported";
                    }
                    result[flag] = marshaler(argsArray);
                }
                return result;
            };
        }
    }
})();
