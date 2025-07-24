let input=document.getElementById("expression")
let output=document.getElementById("output")

/*

const buttons=document.querySelectorAll("#buttons button");
for(let i=0;i<buttons.length;i++)
{
    buttons[i].addEventListener("click", function () 
    {
    const value = buttons[i].textContent;

    if (value === "=") 
    {
      const expression = input.value.trim();
      try 
      {
        const result = evaluate(expression);
        output.textContent = result.toFixed(4);
      } 
      catch (error) 
      {
        output.textContent = "Error";
      }
    } 
    else 
    {
      input.value += value;
    }
  }
)
};
*/


input.addEventListener("keydown", function(event)
{
    if(event.key=="Enter")
    {
        let expression =input.value.trim();
        output.textContent=expression;
        try 
        {
            let result= evaluate(expression);
            output.textContent = result;
        }
        catch
        {
            output.textContent= "Error";
        }
    }
});


function evaluate(expr){
    // trim removed spaces from start and end to remove spaces in between(/\s+) throughout the expreesion (/g)
    expr=expr.replace(/\s+/g,"");

    const function_pattern = /(sqrt|sin|cos|tan)\(([^()]+)\)/;
    while(function_pattern.test(expr))
    {
        let match= expr.match(function_pattern);
    // match[0]	returns	full match, everything found using regex
    	// match [1] returns function name
// match[2] the argument inside ( )
        const func = match[1];        // sqrt, sin, etc.
        const inside = match[2]; 
        const value = evaluate(inside);
        let result;
        if (func==="sqrt")
        {
            if (value<0)
            {
                throw new Error ("Can not take square root of negative value")
            }
            result=Math.sqrt(value);
        }
        else if (func==="sin")
        {
            result= Math.sin((value*Math.PI)/180);
        }
        else if(func==="cos")
        {
            result= Math.cos((value*Math.PI)/180);
        }
        else if(func==="tan")
        {
            result=Math.tan((value*Math.PI)/180);
        }
        else 
        {
            throw new Error ("Invalid function");
        }
        expr=expr.replace(match[0],result.toString())
        // replacing the full match from fuction pattern with the result and converting it into string as the expression is in string

    }

    while (expr.includes("("))
    {
        // start wth parenthesis and end with parenthese , no parenthis exist in betweenn
        let innerexp=expr.match(/\([^()]+\)/);
        if(!innerexp)
        {
            throw new Error("Invalid parenthesis");
        }

        let subexp=innerexp[0].slice(1,-1);
        let subresult=evaluate(subexp);
        expr=expr.replace(innerexp[0],subresult.toString());

    }

    //regular expression to validate the expression
    if (!/^[\d.+\-*/^]+$/.test(expr))
    {
        throw new Error("Invalid expression");
    }
    let tokens= expr.match(/[\d.]+|[+\-*/^]/g) 
    // it will divide the string into tokens

    if(!tokens || tokens.length==0)
    {
        throw new Error("Invalid expression");
    }

    

    //handling exponents
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === "^" )
        {

        let base = parseFloat(tokens[i - 1]);
        let exponent = parseFloat(tokens[i + 1]);

        let result;
        result = Math.pow(base,exponent);
        // Replacing left operand, operator and right opernd
        tokens.splice(i - 1, 3, result.toString());
        i -= 1;

        }
    }
     

    //handling multply and divide 
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === "*" || tokens[i] === "/") 
        {

        let left = parseFloat(tokens[i - 1]);
        let right = parseFloat(tokens[i + 1]);

        let result;
        if (tokens[i] === "*")
        {
            result = left * right;
        } 
        else 
        {
            if (right === 0) throw new Error("Division by zero");
            result = left / right;
        }

        // Replacing left operand, operator and right opernd
        tokens.splice(i - 1, 3, result.toString());
        i -= 1; 
        }
    }

    // handling addition and subraction

    let result = parseFloat(tokens[0]);

    for (let i=1;i<tokens.length;i+=2)
    {
        let operator = tokens[i];
        let operand = parseFloat(tokens[i+1]);
        if (operator==="+")   
        // === to check value and type must be same
        {
            result += operand;
        }
        else if (operator==="-")
        {
            result -= operand;
        }
        else
        {

        throw new Error("Invalid operator");
        }
        
        
    }
    return result;
}









  