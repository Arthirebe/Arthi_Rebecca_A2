const Order = require("./Order");

const OrderState = Object.freeze({
  WELCOMING: Symbol("welcoming"),
  SIZE: Symbol("size"),
  TYPE: Symbol("type"),
  OPTION: Symbol("option"),
  FLAVOUR: Symbol("flavour"),
  VARIETY: Symbol("variety"),
  ADDON: Symbol("addon"),
  TOPPING: Symbol("topping"),
  DRINKS: Symbol("drinks"),
  RECEIPT: Symbol("receipt")
});

module.exports = class BiryaniOrder extends Order {
  constructor(sNumber, sUrl){
    super(sNumber, sUrl);
    this.stateCur = OrderState.WELCOMING;
    this.sSize = "";
    this.sType = "";
    this.sOption = "";
    this.sVariety = "";
    this.sAddon = "";
    this.sFlavour = "";
    this.sTopping = "";
    this.sDrinks = "";
    this.sItem = "";
    this.nPrice = 0;
  }
  handleInput(sInput) {
    let aReturn = [];
    switch (this.stateCur) {
      case OrderState.WELCOMING:
        aReturn.push("Welcome to Arthi's Resturant.");
        aReturn.push("What Biryani size would you like? Please select large, medium or small!");
        this.sItem = "Biryani";
        this.stateCur = OrderState.SIZE;
        aReturn.push("");
        break;
        
        case OrderState.SIZE:
        if ((sInput.toLowerCase() == "large")
          || (sInput.toLowerCase() == "medium")
          || (sInput.toLowerCase() == "small")) {
          this.stateCur = OrderState.TYPE;
          this.sSize = sInput;
          aReturn.push("What type of biryani would you like? Please select Chicken, Egg or Veg!");
        }
        else {
          aReturn.push(`${sInput} is not valid, please type large, medium or small`);
        }
        break;

      //new
      case OrderState.TYPE:
        if ((sInput.toLowerCase() == "chicken")
          || (sInput.toLowerCase() == "egg")
          || (sInput.toLowerCase() == "veg")) {
          this.nPrice = this.nPrice + 15;
          this.stateCur = OrderState.VARIETY;
          this.sType = sInput;
          aReturn.push("Do you want to order semi gravy dish?");
        }
        else {
          aReturn.push(`${sInput} is not valid, please type chicken, egg or veg`);
        }
        break;

        case OrderState.VARIETY:
          if (sInput.toLowerCase() == "no") {
            this.stateCur = OrderState.FLAVOUR;
            this.sVariety = sInput;
            aReturn.push("Do you want to order icecream?");
          }
            else {
              this.stateCur = OrderState.ADDON;
              this.sFlavour = sInput;
              aReturn.push("Type your preference, chicken chilly or paneer chilly?");
            }
            break;

        case OrderState.ADDON:
            if ((sInput.toLowerCase() == "chicken chilly")
          || (sInput.toLowerCase() == "paneer chilly")) {
          this.nPrice = this.nPrice + 10;
          this.stateCur = OrderState.FLAVOUR;
          this.sAddon = sInput;
          aReturn.push("Do you want to order icecream?");
        }
        else {
          aReturn.push(`${sInput} is not valid, please type chicken chilly or paneer chilly`);
        }
        break;

        case OrderState.FLAVOUR:
        if (sInput.toLowerCase() == "no") {
          this.stateCur = OrderState.DRINKS;
          aReturn.push("Would you like drinks with that?");
        }
        else {
          this.stateCur = OrderState.TOPPING;
          this.sFlavour = sInput;
          aReturn.push("Do you want to order Vanilla or Chocolate icecream? NOTE: just type in the flavour eg., vanilla.");
        }
        break;

      case OrderState.TOPPING:
        if ((sInput.toLowerCase() == "vanilla")
          || (sInput.toLowerCase() == "chocolate")) {
          this.nPrice = this.nPrice + 7;
          this.stateCur = OrderState.DRINKS;
          this.sTopping = sInput;
          aReturn.push("Would you like drinks with that?");
        }
        else {
          aReturn.push(`${sInput} is not valid, type vanilla or chocolate`);
        }
        break;

      case OrderState.DRINKS:
        if (sInput.toLowerCase() == "no") {
          // aReturn.push("Thank-you for your order of");
          // aReturn.push(`${this.sSize} ${this.sType} ${this.sItem}`);
          // aReturn.push(`Total amount to be paid is $${this.nPrice}`);
          // aReturn.push(`Please pay for your order here`);
          //   aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
            //this.stateCur = OrderState.PAYMENT;
            this.stateCur = OrderState.RECEIPT;
          
          if (this.sTopping.toLowerCase() == "vanilla" || this.sTopping.toLowerCase() == "chocolate") {
            aReturn.push(`and ${this.sTopping} icecream`);
            aReturn.push(`Total amount to be paid is $${this.nPrice}`);
            aReturn.push(`Please pay for your order here`);
            aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
            this.sTopping=sInput;
            this.stateCur = OrderState.PAYMENT;
          }
          break;
        }
        else {
          //this.nOrder=15;
          this.sDrinks = sInput;
          aReturn.push("Drinks available cocacola,coke,pepsi and sprite!");
          this.stateCur = OrderState.RECEIPT;
        }
        break;

      case OrderState.RECEIPT:
        if ((sInput.toLowerCase() == "cocacola") || (sInput.toLowerCase() == "pepsi")
          || (sInput.toLowerCase() == "coke") || (sInput.toLowerCase() == "sprite")) {
          this.nPrice = this.nPrice + 5;
          this.sDrinks = sInput;
          console.log(this.sTopping);
          aReturn.push("Thank-you for your order of");
          aReturn.push(`${this.sSize} ${this.sType} ${this.sItem}`);
          if(this.sAddon){
            aReturn.push(`with ${this.sAddon}`);
          }
          if (this.sTopping) {
            aReturn.push(`and ${this.sTopping} icecream`);
          }
          if (this.sDrinks) {
            aReturn.push(`with a drink of ${this.sDrinks}`);
          }
          aReturn.push(`Total amount to be paid is $${this.nPrice}`);
          aReturn.push(`Please pay for your order here`);
          aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
          this.stateCur = OrderState.PAYMENT;
        }
        else {
          aReturn.push(`${sInput} is not valid, please type coke or cocacola or pepsi or sprite`);
        }
        break;

      case OrderState.PAYMENT:
        console.log(sInput);
          this.isDone(true);
          let d = new Date();
          d.setMinutes(d.getMinutes() + 20);
        aReturn.push(`Your order will be delivered at ${d.toTimeString()} to below address`);
        console.log(sInput.purchase_units[0]);
        aReturn.push(`${sInput.purchase_units[0].shipping.address.address_line_1}
                ,${sInput.purchase_units[0].shipping.address.address_line_2}
                ,${sInput.purchase_units[0].shipping.address.admin_area_2}
                ,${sInput.purchase_units[0].shipping.address.admin_area_1}
                ,${sInput.purchase_units[0].shipping.address.postal_code}
                ,${sInput.purchase_units[0].shipping.address.country_code}`);
        break;
    }
    return aReturn;
  }
  renderForm(sTitle = "-1", sAmount = "-1") {
    // your client id should be kept private
    if (sTitle != "-1") {
      this.sItem = sTitle;
    }
    if (sAmount != "-1") {
      this.nOrder = sAmount;
    }
    const sClientID = process.env.SB_CLIENT_ID || `ATPUSD5vhcoCdajODRXEIdE1loglgMaLQzlWo7JwnJF0_vfH4jj8IK_dZs3wdPW_pOponPif049SFUgG`
    return (`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.sItem} order of $${this.nPrice}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nPrice}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);

  }
}