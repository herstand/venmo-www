function loadPayChargeUI() {
$("#left_and_right .rectBox").html("<div style='color:#6a757f; padding:20px;'><h2 style='line-height:20px; padding:0px; margin-top:0px; margin-left:0px;'><img style='float:left;margin-right:10px;display:inline-block; ' src='"+venmo.logged_in_user_profile_picture+"' />"+venmo.logged_in_user.best_full_name+"<br /><span style='font-size:12px;'>Pay or charge a friend.</span></h2><br /><form action='/transaction/create' method='get' id='payCharge'><label style='display:inline-block; width:100px' for='amount'>Amount:</label> <input type='text' id='amount' name='amount' placeholder='Amount…' /><br /><br /><label style='vertical-align:middle; height:38px; display:inline-block;width:100px' for='recipient'>Add Recipients:</label> <div style='border:1px solid #999; padding:3px; display:inline-block;position:relative;'><div style='float:left;' id='onebox_typeahead_wrapper'><input style='vertical-align:middle;' type='text' id='onebox_typeahead' placeholder='Type recipient&apos;s name…' name='recipient' /></div></div><br /><label style='display:inline-block; width:100px' for='note'>Note:</label> <input type='text' maxlength='140' name='note' id='note' placeholder='Note' /><br /><br /><button type='button' name='pay' id='pay' value='pay'>Pay</button><button style='margin-left:40px' type='button' name='charge' id='charge' value='charge'>Charge</button><input type='hidden' value='' id='payOrCharge' name='payOrCharge' /></form></div>"); 
}
loadPayChargeUI();
venmo.load.autoCompleters(); 
$("button").click(function(e){
  $("#payOrCharge").val(e.target.name); 
  $("form#payCharge").submit(); 
}); 
$("#payCharge").submit(function(e){
 e.preventDefault(); 
 var txnData = {
  transaction_type: $("#payOrCharge").val(),
  recipient: $("form#payCharge .onebox_recipient_link td")[0].innerText,
  amount: $("form#payCharge #amount").val(),
  note: $("form#payCharge #note").val(),
  publish_to_facebook: false,
  publish_to_venmo: true,
  audience: "private",
  accept_risk : true,
  bank_account_id : venmo.logged_in_user.external_id,
  publish : true,
  is_last_payment : true,
  csrfmiddlewaretoken : goog.net.cookies.get("csrftoken2"),
  service_type : $("form#payCharge .onebox_recipient_link td")[0].innerText
}; 
console.log("Sending data: ", txnData);
venmo.utils.ajax("/transaction/create", txnData, {
 complete: function(e) {
    var rawResponse = e.getResponseJson();
    var processedResponse = venmo.utils.getAjaxResponse(e);
    console.log(rawResponse, processedResponse);
    if (processedResponse.success) {
      $("#payCharge").html("<h2 style='color:#00AA00;'>Success: "+venmo.data.resp+"</h2>");
    } else {
      $("#payCharge").html("<h2 style='color:#AA0000'>" + venmo.api_messages.title+" [Code: "+venmo.api_messages.error_code+"]: " + venmo.api_messages.api_message +"</h2>");
    }
 }
});
return false;
});
