var Args = (function()
{
    function compose(fn1, fn2){return function(){return fn2(fn1.apply(this,arguments))}}

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

    var shift = function(arr){ return arr.shift()};

    var marshalers = {
        number: compose(shift, parseFloat),
        string: compose(shift),
        boolean: function(x) {return true;},
        numberList: compose(shift, function(x){ return x.split(",").map(parseFloat)})
    }

    return {
        create: function(schema)
        {
            var params = flatParams(schema || {});
            return function(args)
            {
                var argsArray = (args || "").split(" ");
                var result = {};
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