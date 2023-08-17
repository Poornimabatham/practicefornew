export default class GetapprovalRegularService {

    public static async GetregularizationApproverRejectedAPI(data) {
       var ActivityBy=0; 
		 var module="";
		 var count=0;
		 var count1=0;
		 var errorMsg="";
		 var successMsg=""; 
		var Msg1="Regularization could not be rejected."; 
		var Msg="Regularization could not be approved."; 
		var status=false;
		var count11=0;
		var con=0;
		var regularizetimein='00:00:00';
		var newtimeout='00:00:00';
        if(data.RegularizationAppliedFrom!=2){
			ActivityBy=0;
			module = "ubiHRM APP";
		}
		if(data.RegularizationAppliedFrom == 2)
		{
			ActivityBy=1;
			module = "ubiattendance APP";
		}	
console.log(ActivityBy)
console.log(module)
}
}