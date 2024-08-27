// const { contains } = require("validator");

// Object `Validaor`
function Validator(options){

  //  var selectorRules = {};
  // validate function
  var selectorRules = {};
  function validate(inputElement,rule){
      var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage
      
         var rules = selectorRules[rule.selector];
          for(var i = 0; i < rules.length ; ++i){
          errorMessage = rules[i](inputElement.value);
          if(errorMessage)
            break;
          // console.log(errorMessage);
          }

      if(errorMessage){
        errorElement.innerText = errorMessage;
        inputElement.parentElement.classList.add("invalid")
      }
      else{ 
        errorElement.innerText = ""
        inputElement.parentElement.classList.remove("invalid")
      }
      return !errorMessage;
      
  }

  //getElement of Form
  var formElement = document.querySelector(options.form);
  if(formElement){
    formElement.onsubmit = function(e){
      e.preventDefault();

      var isFormValid = true;
      // Loop via rule and validate
      options.rules.forEach((rule) =>{
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement,rule);
        if(!isValid) 
          isFormValid = false;
      });
      if(isFormValid){
        if(typeof options.onSubmit === 'function'){
           var enableInputs = formElement.querySelectorAll('[name]:not([diable])')
           var formValues = Array.from(enableInputs).reduce(function(values, input){
                  return (values[input.name] = input.value) && values
           }, {})
           options.onSubmit(formValues);
        }
      }
       
    }
    options.rules.forEach((rule) =>{
        console.log(rule.selector)
        // Lưu lại các rule cho mỗi input
        if(Array.isArray(selectorRules[rule.selector])){
          selectorRules[rule.selector].push(rule.test);
        }
        else{
          selectorRules[rule.selector] = [rule.test];
        }
       
        var inputElement = formElement.querySelector(rule.selector);
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        if(inputElement){
          // xử lý trường hợp blur khỏi input
            inputElement.onblur = function(){
            validate(inputElement,rule) 
            }
          // xử lý mỗi khi người dùng nhập vào input            
            inputElement.oninput =function(){
              errorElement.innerText = ""
              inputElement.parentElement.classList.remove("invalid")
            }
        }
    });
     console.log(selectorRules)
  }
}

//Defination
//Priority of rules
//1. When have error => Return message error
//2. When valid   => No return (unde)
Validator.isRequired = function (selector,message){
    return {
        selector: selector,
        test: function(value){
          return value.trim() ? undefined : message|| "Vui lòng nhập trường này"
        }
    };
}

Validator.isEmail = function (selector, message){
  return {
      selector: selector,
      test: function(value){
        const regex =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return regex.test(value) ? undefined : message || "Email không hợp lệ"
      } 
  };
}

Validator.minLength = function (selector,min, message){
  return {
      selector: selector,
      test: function(value){
        return value.length >=min ? undefined : message || `Password không được ít hơn ${min} ký tự`
      } 
  };
}


Validator.isConfirmed = function (selector, getCofirmValue , message){
  return {
      selector: selector,
      test: function(value){
          return value === getCofirmValue() ? undefined : (message || "Giá trị nhập vào không hợp lệ")
      } 
  };
}