let input = document.getElementById("expression");
let output = document.getElementById("output");

const buttons = document.querySelectorAll("#buttons button");

for (let i = 0; i < buttons.length; i++) 
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
    else if (value === "C") 
    {
      input.value = "";
      output.textContent = "";
    } 
    else if (value === "B") 
        {
      input.value = input.value.slice(0, -1);
    } 
    else 
        {
      input.value += value;
    }
  }
);
}

input.addEventListener("keydown",function(event)
{
const allowed_keys=['1','2','3','4','5','6','7','8','9','0','/','*','+','-','(',')','^','Backspace','ArrowLeft','ArrowRight'];
if(!allowed_keys.includes(event.key))
{
    event.preventDefault();
}
if(event.key=='Enter')
{
try
{
    const expression=input.value.trim();
    const result=evaluate(expression);
    output.textContent=result.toFixed(4);
}
catch(error)
{
    output.textContent='Error';
}
}
}
)

function func(expr)
{
    const function_pattern = /(sqrt|sin|cos|tan)\(([^()]+)\)/;
    while(function_pattern.test(expr))
    {
        let match= expr.match(function_pattern);
    // match[0]	returns	full match, everything found using regex
    // match [1] returns function name
    // match[2] the argument inside ( )
        const func = match[1];        
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
    }
return expr;
}

function add_sub(tokens)
{
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

function mul_div(tokens)
{
    for (let i = 0; i < tokens.length; i++) 
        {
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
    return tokens;
}

function exp(tokens)
{
        for (let i = 0; i < tokens.length; i++) 
        {
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
    return tokens;
}

function parenthesis(expr)
{
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
    return expr;
}

function exp_valid_token_creation(expr)
{
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
    return tokens;
}

function evaluate(expr)
{
    // trim removed spaces from start and end to remove spaces in between(/\s+) throughout the expreesion (/g)
    expr=expr.replace(/\s+/g,"");
    expr=func(expr);
    expr=parenthesis(expr);
    let tokens=exp_valid_token_creation(expr);
    tokens=exp(tokens);
    tokens=mul_div(tokens);
    let result = add_sub(tokens);
    return result;
}









  