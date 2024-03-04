public function AddUpdateOrganization()
{
$result = array();$errorMsg=""; $successMsg=""; $status=false;$shiftid='';$departid='';
$data = array(); $aa='';$modules='';$countu=0;
    // Get post data variable submitted from form
$planid= isset($_POST['planid'])? $_POST['planid']: "1";
$name= isset($_POST['company_name'])? $_POST['company_name']: "";
$website= isset($_POST['company_website'])?$_POST['company_website']: "";
$number= isset($_POST['contact_number'])? $_POST['contact_number']: "";
$noOfEmployee= isset($_POST['noOfEmployee'])? $_POST['noOfEmployee']: "";
$alt_number= isset($_POST['alternate_number'])?$_POST['alternate_number']: "";
$email= isset($_POST['email_address'])? $_POST['email_address']: "";
$alt_email= isset($_POST['alternate_email'])? $_POST['alternate_email'] : "";
$address = isset($_POST['address'])? $_POST['address']: "";
$country = isset($_POST['country'])? $_POST['country']: "";
$landmark = isset($_POST['landmark'])? $_POST['landmark']: "";
$city = isset($_POST['city'])? $_POST['city'] : "";
$zip_code = isset($_POST['zip_code'])? $_POST['zip_code']: "";
$currency = isset($_POST['currency'])? $_POST['currency'] : "";
$timezone = isset($_POST['timezone'])? $_POST['timezone'] : "";
$dateformate = isset($_POST['dateformate'])? $_POST['dateformate']: "";
$timeformate = isset($_POST['timeformate'])? $_POST['timeformate']: "";
$about = isset($_POST['about'])? $_POST['about']: "";
$division_name = isset($_POST['division_name'])? $_POST['division_name']: "";
//echo $division_name;
$divisionid = isset($_POST['division_id'])? $_POST['division_id']: "";
$desid = isset($_POST['designation_id'])? $_POST['designation_id']: "";
$division_code = isset($_POST['division_code'])? $_POST['division_code']: "";
$orgid= isset($_POST['orgid'])? $_POST['orgid']: 0;
$statusubihrm= isset($_POST['statusubihrm'])? $_POST['statusubihrm']: 0;

$startdate1= isset($_POST['startdate'])? $_POST['startdate']: "";
$startdate1 = str_replace('/', '-', $startdate1);
$startdate=date("Y-m-d", strtotime($startdate1));

$enddate1= isset($_POST['enddate'])? $_POST['enddate']: "";
$countrycode= isset($_POST['countrycode'])? $_POST['countrycode']: "";
$enddate1 = str_replace('/', '-', $enddate1);
$enddate=date("Y-m-d", strtotime($enddate1));

$employee = $_POST['employee'];
$attendance =$_POST['attendance'];
$leave = $_POST['leave'];
$timesheet =$_POST['timesheet'];
$salary = $_POST['salary'];
$payroll = $_POST['payroll'];
$performance =$_POST['performance'];
$organization =$_POST['organization'];
$Loginuser_id = $_SESSION['OrgBuilder_Loginuser_id'];
if($employee=='true'){ $aa .=1 .',';}
if($attendance=='true'){ $aa .=2 .',';}
if($leave=='true'){ $aa .=3 .',';}
if($timesheet=='true'){ $aa .=7 .',';}
if($salary=='true'){ $aa .=4 .',';}
if($payroll=='true'){ $aa .=8 .',';}
if($performance=='true'){ $aa .=6 .',';}
if($organization=='true'){ $aa .=5 .',';}


$modules= rtrim($aa,',');

$orgid1 =$orgid;
    $count1=0;$count2 =0;$count =0;
$mdate = date("Y-m-d H:i:s");
$mid =0;

$isuserexist=false;
$sql5 = "SELECT * FROM Organization WHERE Email = ? and Id!=?";
$query5 = $this->db->prepare($sql5);
$query5->execute(array($email,$orgid));
$count1 =  $query5->rowCount();
//echo $count1;

$sql6 = "SELECT * FROM Organization WHERE PhoneNumber = ? and Id!=?";
$query6 = $this->db->prepare($sql6);
$query6->execute(array($number,$orgid));
$counttt2 =  $query6->rowCount();
//echo $counttt2;


if($count1==0)
{
if($counttt2==0)
{
if($name!="")
{
if ($orgid!=0)
{

$sql2 = "UPDATE Organization SET PlanId=:planid, Name=:name, Website=:website, PhoneNumber=:number, NoOfEmp=:noOfEmployee,  AltPhoneNumber=:altnumber, Email=:email, AltEmail=:altemail, Address=:address, Country=:country, City=:city, ZipCode=:zipcode, Landmark=:landmark, Currency=:currency, DateFormat=:dateformat, TimeFormat=:timeformat, TimeZone=:timezone, AboutCompany=:about, LastModifiedDate=:mdate, LastModifiedById=:mid,modules=:modul, ubihrm_sts=1 where Id=:id";
$query2 = $this->db->prepare($sql2);
$query2->execute(array(':planid' => $planid,':name' => $name, ':website' => $website, ':number' => $number,  ':noOfEmployee' => $noOfEmployee,':altnumber' => $alt_number, ':email' => $email, ':altemail' => $alt_email, ':address' => $address, ':country' => $country, ':city' => $city, ':zipcode' => $zip_code, ':landmark' => $landmark, ':currency' => $currency, ':dateformat' => $dateformate, ':timeformat' => $timeformate, ':timezone' => $timezone, ':about' => $about, ':mdate' => $mdate, ':mid' => $mid,':modul'=>$modules, ':id' => $orgid ));

$count2 =  $query2->rowCount();
$sql1 = "UPDATE licence_ubihrm SET start_date=?, end_date=?, planstatus=? where OrganizationId =?";
$query1 = $this->db->prepare($sql1);
$query1->execute(array($startdate,$enddate, $statusubihrm, $orgid ));

$sql="UPDATE DivisionMaster SET Name=:division_name, ContactPerson=:name, ContactNumber=:number, AltContactNumber=:altnumber, Email=:email, Address=:address, CountryId=:country, CityId=:city, ZipCode=:zipcode, Landmark=:landmark, CurrencyId=:currency, DateFormatId=:dateformat, TimeFormatId=:timeformat,TimeZoneId=:timezone, CreatedDate=:cdate, Code=:division_code, LastModifiedDate=:mdate WHERE OrganizationId=:orgid";
$query = $this->db->prepare($sql);
$query->execute(array(':division_name' => $division_name, ':name' => $name,':number' => $number, ':altnumber' => $alt_number, ':email' => $email, ':address' => $address, ':country' => $country, ':city' => $city, ':zipcode' => $zip_code, ':landmark' => $landmark, ':currency' => $currency, ':dateformat' => $dateformate, ':timeformat' => $timeformate, ':timezone' => $timezone,':cdate' => $mdate, ':division_code' => $division_code,':mdate' => $mdate, ':orgid' =>$orgid ));
$count =  $query->rowCount();



////////////check if there is an entry of user profile already exist////////////

$sql4="Select * from `Userprofile` where OrganizationId =?";
$query4 = $this->db->prepare($sql4);
$query4->execute(array($orgid));
$countu=$query4->rowCount();
if($countu ==0)
{
$sql4="INSERT INTO `Userprofile`( `UserName`, `CreatedDate`,  `LastModifiedDate`,  `OrganizationId`, AdminSts, Description) VALUES ('Admin', '$mdate', '$mdate', $orgid, 1, 'User with Admin profile has permission to access all the ubiHRM modules given with the plan. He can create, View, Edit, Delete data of all Employees.')";
$query4 = $this->db->prepare($sql4);
$query4->execute();
$userprofileid = $this->db->lastInsertId();

/* $sql2 = "SELECT * FROM OrgPermission where OrgId=? and ViewPermission=1";
$query2 = $this->db->prepare($sql2);
$query2->execute(array($orgid));
$count2 =  $query2->rowCount();
while($row = $query2->fetch())
{
$moduleid = $row->ModuleId;
$tabid =$row->TabId;

$sql5="INSERT INTO `UserProfile_permission`(`Userprofileid`, `ModuleId`, `ViewPermission`, `AddPermission`, `EditPermission`, `DeletePermission`, `OrganizationId`,  `CreatedDate`, `LastModifiedDate`) VALUES ($userprofileid, $moduleid, 1, 1, 1, 1, $orgid, '$mdate',  '$mdate') ";
$query5 = $this->db->prepare($sql5);
$query5->execute();
}
*/
///////////////////////////////////////////////////   NIDHI //////////////////////////////////////////////////////////

$sql4="INSERT INTO `Userprofile`( `UserName`, `CreatedDate`,  `LastModifiedDate`,  `OrganizationId`, AdminSts, Description) VALUES ('HR Profile', '$mdate', '$mdate', $orgid, 3, 'User with HR Profile  has permission to access all the ubiHRM modules given with the plan. He can create, View, Edit, Delete data of all Employees.')";
$query4 = $this->db->prepare($sql4);
$query4->execute();
$userprofileid2 = $this->db->lastInsertId();

/* $sql2 = "SELECT * FROM OrgPermission where OrgId=? and ViewPermission=1";
$query2 = $this->db->prepare($sql2);
$query2->execute(array($orgid));
$count2 =  $query2->rowCount();
while($row = $query2->fetch())
{
$moduleid = $row->ModuleId;
$tabid =$row->TabId;

$sql5="INSERT INTO `UserProfile_permission`(`Userprofileid`, `ModuleId`, `ViewPermission`, `AddPermission`, `EditPermission`, `DeletePermission`, `OrganizationId`,  `CreatedDate`, `LastModifiedDate`) VALUES ($userprofileid2, $moduleid, 1, 1, 1, 1, $orgid, '$mdate',  '$mdate') ";
$query5 = $this->db->prepare($sql5);
$query5->execute();
} */

/////////////////////////////////////////////////


///////////////////////////////////////////////////   VANSHIKA //////////////////////////////////////////////////////////

/* $sql2 = "SELECT * FROM OrgPermission where OrgId=? and ViewPermission=0";
$query2 = $this->db->prepare($sql2);
$query2->execute(array($orgid));
$count2 =  $query2->rowCount();
while($row = $query2->fetch())
{
$moduleid = $row->ModuleId;
$tabid =$row->TabId;

$sql5="INSERT INTO `UserProfile_permission`(`Userprofileid`, `ModuleId`, `ViewPermission`, `AddPermission`, `EditPermission`, `DeletePermission`, `OrganizationId`,  `CreatedDate`, `LastModifiedDate`) VALUES ($userprofileid, $moduleid, 0, 0, 0, 0, $orgid, '$mdate',  '$mdate') ";
$query5 = $this->db->prepare($sql5);
$query5->execute();
} */

///////////////////////////////////////////////////   VANSHIKA //////////////////////////////////////////////////////////

///////////Enter 2 more user profile/////MANAGER AND USER////////


$sql4="INSERT INTO `Userprofile`( `UserName`, `CreatedDate`,  `LastModifiedDate`,  `OrganizationId` , Description,AdminSts,dataaccess) VALUES ('Manager', '$mdate', '$mdate', $orgid , 'User with Manager profile has permission to access only the ubiHRM modules the Admin has given access to. He can create, View, Edit, Delete data of himself & his team.' , 2 , 2)";
$query4 = $this->db->prepare($sql4);
$query4->execute();
$userprofileid1 = $this->db->lastInsertId();

//////////NOT GIVING GENERATE SALARY AND ORGANIZATION PERMISSION TO MANAGER PROFILE///////

/* $sql2 = "SELECT * FROM OrgPermission where OrgId=? and ViewPermission=1 and TabId <> 5 and ModuleId not in (66)";
$query2 = $this->db->prepare($sql2);
$query2->execute(array($orgid));
$count2 =  $query2->rowCount();
while($row = $query2->fetch()){
$moduleid = $row->ModuleId;
$tabid =$row->TabId;

$sql5="INSERT INTO `UserProfile_permission`(`Userprofileid`, `ModuleId`, `ViewPermission`,  `EditPermission`, `OrganizationId`,  `CreatedDate`, `LastModifiedDate`) VALUES ($userprofileid1, $moduleid, 1, 1, $orgid, '$mdate',  '$mdate') ";
$query5 = $this->db->prepare($sql5);
$query5->execute();


} */

////////////////////////////////////////////////////


$sql4="INSERT INTO `Userprofile`( `UserName`, `CreatedDate`,  `LastModifiedDate`,  `OrganizationId` , Description) VALUES ('Standard User', '$mdate', '$mdate', $orgid , 'A standard user can only access self service only. He has view & edit permission for his data only.' )";
$query4 = $this->db->prepare($sql4);
$query4->execute();


}


}
else
{
$div_name="";
$sql2 = "INSERT INTO Organization (PlanId, Name, Website, PhoneNumber, NoOfEmp, AltPhoneNumber, Email, AltEmail, Address, no_admin, Country, City, ZipCode, Landmark, Currency, DateFormat, TimeFormat, TimeZone, AboutCompany, LastModifiedDate, LastModifiedById, CreatedDate, CreatedById,ubihrm_sts,countrycode,modules) VALUES (:planid,:name, :website, :number, :noOfEmployee, :altnumber, :email, :altemail, :address,:noofadmin, :country, :city, :zipcode, :landmark, :currency, :dateformat, :timeformat, :timezone, :about, :mdate, :mid, :cdate, :cid,1,:countrycode,:modul)";
$query2 = $this->db->prepare($sql2);
$query2->execute(array(':planid' => $planid,':name' => $name, ':website' => $website, ':number' => $number, ':noOfEmployee' => $noOfEmployee, ':altnumber' => $alt_number, ':email' => $email, ':altemail' => $alt_email, ':address' => $address, ':noofadmin' => 1, ':country' => $country, ':city' => $city, ':zipcode' => $zip_code, ':landmark' => $landmark, ':currency' => $currency, ':dateformat' => $dateformate, ':timeformat' => $timeformate, ':timezone' => $timezone, ':about' => $about, ':mdate' => $mdate, ':mid' => $mid, ':cdate' => $mdate, ':cid' => $mid ,':countrycode'=>$countrycode,':modul'=>$modules,));


$count2 =  $query2->rowCount();
if ($count2 == 1) {


$status=true;
$orgid1 =$this->db->lastInsertId();

$sql = "insert into licence_ubihrm (start_date,end_date, planstatus,OrganizationId,CreatedDate)values(?,?,?,?,?)";
$query = $this->db->prepare($sql);
$query->execute(array($startdate,$enddate, $statusubihrm, $orgid1,$mdate));
$count =  $query->rowCount();


////////////check if there is an entry of user profile already exist////////////

$sql4="Select * from `Userprofile` where OrganizationId =?";
$query4 = $this->db->prepare($sql4);
$query4->execute(array($orgid1));
$countu=$query4->rowCount();

if($countu ==0)
{
$sql4="INSERT INTO `Userprofile`( `UserName`, `CreatedDate`,  `LastModifiedDate`,  `OrganizationId`, AdminSts, Description) VALUES ('Admin', '$mdate', '$mdate', $orgid1, 1, 'User with Admin profile has permission to access all the ubiHRM modules given with the plan. He can create, View, Edit, Delete data of all Employees.')";
$query4 = $this->db->prepare($sql4);
$query4->execute();
$userprofileid = $this->db->lastInsertId();

/* $sql2 = "SELECT * FROM OrgPermission where OrgId=? and ViewPermission=1";
$query2 = $this->db->prepare($sql2);
$query2->execute(array($orgid1));
$count22 =  $query2->rowCount();

while($row = $query2->fetch())
{
$moduleid = $row->ModuleId;
$tabid =$row->TabId;

$sql5="INSERT INTO `UserProfile_permission`(`Userprofileid`, `ModuleId`, `ViewPermission`, `AddPermission`, `EditPermission`, `DeletePermission`, `OrganizationId`,  `CreatedDate`, `LastModifiedDate`) VALUES ($userprofileid, $moduleid, 1, 1, 1, 1, $orgid1, '$mdate',  '$mdate') ";
$query5 = $this->db->prepare($sql5);
$query5->execute();
} */

///////////////////////////////////////////////////   NIDHI //////////////////////////////////////////////////////////

$sql4="INSERT INTO `Userprofile`( `UserName`, `CreatedDate`,  `LastModifiedDate`,  `OrganizationId`, AdminSts, Description) VALUES ('HR Profile', '$mdate', '$mdate', $orgid1, 3, 'User with HR Profile  has permission to access all the ubiHRM modules given with the plan. He can create, View, Edit, Delete data of all Employees.')";
$query4 = $this->db->prepare($sql4);
$query4->execute();
$userprofileid2 = $this->db->lastInsertId();

/* $sql2 = "SELECT * FROM OrgPermission where OrgId=? and ViewPermission=1";
$query2 = $this->db->prepare($sql2);
$query2->execute(array($orgid1));
$count2 =  $query2->rowCount();
while($row = $query2->fetch())
{
$moduleid = $row->ModuleId;
$tabid =$row->TabId;

$sql5="INSERT INTO `UserProfile_permission`(`Userprofileid`, `ModuleId`, `ViewPermission`, `AddPermission`, `EditPermission`, `DeletePermission`, `OrganizationId`,  `CreatedDate`, `LastModifiedDate`) VALUES ($userprofileid2, $moduleid, 1, 1, 1, 1, $orgid1, '$mdate',  '$mdate') ";
$query5 = $this->db->prepare($sql5);
$query5->execute();
} */

/////////////////////////////////////////////////


///////////////////////////////////////////////////   VANSHIKA //////////////////////////////////////////////////////////

/* $sql2 = "SELECT * FROM OrgPermission where OrgId=? and ViewPermission=0";
$query2 = $this->db->prepare($sql2);
$query2->execute(array($orgid1));
$count2 =  $query2->rowCount();
while($row = $query2->fetch())
{
$moduleid = $row->ModuleId;
$tabid =$row->TabId;

$sql5="INSERT INTO `UserProfile_permission`(`Userprofileid`, `ModuleId`, `ViewPermission`, `AddPermission`, `EditPermission`, `DeletePermission`, `OrganizationId`,  `CreatedDate`, `LastModifiedDate`) VALUES ($userprofileid, $moduleid, 0, 0, 0, 0, $orgid1, '$mdate',  '$mdate') ";
$query5 = $this->db->prepare($sql5);
$query5->execute();
} */

///////////////////////////////////////////////////   VANSHIKA //////////////////////////////////////////////////////////

///////////Enter 2 more user profile/////MANAGER AND USER////////


$sql4="INSERT INTO `Userprofile`( `UserName`, `CreatedDate`,  `LastModifiedDate`,  `OrganizationId` , Description,AdminSts,dataaccess) VALUES ('Manager', '$mdate', '$mdate', $orgid1, 'User with Manager profile has permission to access only the ubiHRM modules the Admin has given access to. He can create, View, Edit, Delete data of himself & his team.' , 2 , 2)";
$query4 = $this->db->prepare($sql4);
$query4->execute();
$userprofileid1 = $this->db->lastInsertId();

//////////NOT GIVING GENERATE SALARY AND ORGANIZATION PERMISSION TO MANAGER PROFILE///////

/* $sql2 = "SELECT * FROM OrgPermission where OrgId=? and ViewPermission=1 and TabId <> 5 and ModuleId not in (66)";
$query2 = $this->db->prepare($sql2);
$query2->execute(array($orgid1));
$count23 =  $query2->rowCount();
while($row = $query2->fetch()){
$moduleid = $row->ModuleId;
$tabid =$row->TabId;

$sql5="INSERT INTO `UserProfile_permission`(`Userprofileid`, `ModuleId`, `ViewPermission`,  `EditPermission`, `OrganizationId`,  `CreatedDate`, `LastModifiedDate`) VALUES ($userprofileid1, $moduleid, 1, 1, $orgid1, '$mdate',  '$mdate') ";
$query5 = $this->db->prepare($sql5);
$query5->execute();


} */

////////////////////////////////////////////////////


$sql4="INSERT INTO `Userprofile`( `UserName`, `CreatedDate`,  `LastModifiedDate`,  `OrganizationId` , Description) VALUES ('Standard User', '$mdate', '$mdate', $orgid1 , 'A standard user can only access self service only. He has view & edit permission for his data only.' )";
$query4 = $this->db->prepare($sql4);
$query4->execute();


}

$j=1;
$divcode="DIV0000".$j;
$shortname="";

//////////////////// end here/////////
$div_name=$name;
$shortname = mb_substr($div_name, 0, 2);

$sql="INSERT INTO DivisionMaster(OrganizationId, Name, ContactPerson, ContactNumber, AltContactNumber, Email, Address, CountryId, CityId, ZipCode, Landmark, CurrencyId, DateFormatId, TimeFormatId,TimeZoneId, CreatedDate, Code,ShortName,LastModifiedDate)VALUES(:orgid, :division_name, :name, :number, :altnumber, :email, :address, :country, :city, :zipcode, :landmark, :currency, :dateformat, :timeformat, :timezone, :cdate , :division_code,:shortnam , :mdate)";
//echo $sql;
$query = $this->db->prepare($sql);
$cityname=Utils::getName($city,'CityMaster','Name',$this->db);
$query->execute(array(':orgid' =>$orgid1, ':division_name' => $div_name, ':name' => $cityname,':number' => $number, ':altnumber' => $alt_number, ':email' => $email, ':address' => $address, ':country' => $country, ':city' => $city, ':zipcode' => $zip_code, ':landmark' => $landmark, ':currency' => $currency, ':dateformat' => $dateformate, ':timeformat' => $timeformate, ':timezone' => $timezone,':cdate' => $mdate, ':division_code' => $divcode, ':shortnam' => $shortname, ':mdate' => $mdate));
$count =  $query->rowCount();
$divisionid = $this->db->lastInsertId();
   //echo $divisionid;
   /////////////////DEFAULT SHIFT CREATE/////////////////////
   $sql1="INSERT INTO ShiftMaster(Name,TimeIn,TimeOut,TimeInGrace,TimeOutGrace,OrganizationId , CreatedDate, LastModifiedDate) VALUES ('Trial Shift','09:30:00','18:30:00','09:30:00','18:30:00',:orgid,:cdate, :mdate)";
   $query = $this->db->prepare($sql1);
$query->execute(array(':orgid' =>$orgid1, ':cdate' => $mdate , ':mdate' => $mdate));
$count =  $query->rowCount();
$shiftid = $this->db->lastInsertId();

   /////////////////DEFAULT DEPARTMENT CREATE/////////////////////
   $lastdeptcode=0;
   $dept =array('Trial Department','HR','Finance','Sales');
for($i=0; $i< count($dept); $i++)
{
$v ="";
$k=0;
$k=$i+1;
$v = 'DEP0000'.$k;
$sql1="INSERT INTO DepartmentMaster(Name, OrganizationId , CreatedDate,Code, LastModifiedDate) VALUES (:dept,:orgid,:cdate,:code,:mdate)";
       $query = $this->db->prepare($sql1);
$query->execute(array(':dept' =>$dept[$i],':orgid' =>$orgid1, ':cdate' => $mdate,':code' => $v, ':mdate' => $mdate));
$count =  $query->rowCount();
$departid = $this->db->lastInsertId();
}
$lastdeptcode=$i;

$lastdesicode=0;
$desig =array('Trial Designation','Admin','Director','Manager','Executive','Clerk');
for($i=0; $i< count($desig); $i++)
{
$v ="";
$k=0;
$k=$i+1;
$v = 'DES0000'.$k;
$sql1="INSERT INTO DesignationMaster(Name, OrganizationId , CreatedDate,Code,LastModifiedDate) VALUES (:desig,:orgid,:cdate,:code,:mdate)";

$query = $this->db->prepare($sql1);
$query->execute(array(':desig' =>$desig[$i],':orgid' =>$orgid1, ':cdate' => $mdate, ':code' => $v , ':mdate' => $mdate));
$count =  $query->rowCount();
$desid = $this->db->lastInsertId();

}
$lastdesicode=$i;
   ///////////////DEFAULT DESIGNATIONS//////////////////
   ///////////////START DEFAULT POLICIES//////////////////
$count12=0;$count112=0;


$policies =array('Leave Policy','Appraisal Policy');

for($i=0; $i< count($policies); $i++)
{
if($policies[$i]=='Leave Policy'){
$desccat='You shall be entitled to 12 paid leave per year. Public holidays will be additional to the usual leave entitlement. Person shall be entitled for 1 leave per month. Balance leave accumulate at the end of the year.';
}
if($policies[$i]=='Appraisal Policy'){
$desccat='The annual employee appraisal will be in accordance with his/her performance and will vary from person to person. Growth and increase in salary will depend solely on the employee performance and contribution to the company.';
}


$sql2="select Name from CategoryMaster where Name=? and OrganizationId=? and TypeId=? ";
$query12=$this->db->prepare($sql2);
$query12->execute(array($policies[$i],$orgid1,6));
$count12=$query12->rowCount();
if($count12==0){
$sql1="INSERT INTO CategoryMaster(Name, OrganizationId , CreatedDate,TypeId,LastModifiedDate) VALUES (:policies,:orgid,:cdate,:typeid,:mdate)";

$query = $this->db->prepare($sql1);
$query->execute(array(':policies' =>$policies[$i],':orgid' =>$orgid1, ':cdate' => $mdate ,':typeid'=>'6' , ':mdate' => $mdate ));
$count =  $query->rowCount();
$policiesid = $this->db->lastInsertId();


$sql="select Name from PolicyMaster where CategoryId=? and OrganizationId=?";
$query = $this->db->prepare($sql);
$query->execute(array($policiesid,$orgid1));
$count112=  $query->rowCount();
if ($count112 ==0)
{

$sql2="INSERT INTO PolicyMaster(Name,CategoryId, OrganizationId , CreatedDate, LastModifiedDate) VALUES (:desccat,:catid,:orgid,:cdate,:mdate)";

$query2 = $this->db->prepare($sql2);
$query2->execute(array(':desccat' =>$desccat,':catid'=>$policiesid,':orgid' =>$orgid1, ':cdate' => $mdate , ':mdate' => $mdate));
//$count112=$query2->rowCount();
}
}
}
/////////////// END DEFAULT POLICIES//////////////////

/////////////// START DEFAULT BANK CODE//////////////////

$lastbankcode=0;
$bank =array('Citi Bank','HSBC','Axis Bank','HDFC Bank');

for($i=0; $i< count($bank); $i++)
{
$v ="";
$k=0;
$k=$i+1;
$v = 'BANK0000'.$k;


$sql1="INSERT INTO BankMaster (Name, Code, OrganizationId, CreatedDate, LastModifiedDate) VALUES (?, ?, ?, ?,?)";

$query = $this->db->prepare($sql1);
$query->execute(array($bank[$i],$v, $orgid1, $mdate, $mdate));
$count =  $query->rowCount();




}
$lastbankcode=$i;

/////////////// END DEFAULT BANK CODE//////////////////

/////////////// START DEFAULT EMPLOYEETYPE CODE//////////////////

$lastemptpecode=0;
$emptype =array('Part Time','Full Time','Training','Contractual');

for($i=0; $i< count($emptype); $i++)
{
$v ="";
$k=0;
$k=$i+1;
$v = 'EMPTYP0000'.$k;


$sql1="INSERT INTO EmploymentTypeMaster (Name, Code, OrganizationId, CreatedDate, LastModifiedDate) VALUES (?, ?, ?, ?, ?)";

$query = $this->db->prepare($sql1);
$query->execute(array($emptype[$i],$v, $orgid1, $mdate, $mdate));
$count =  $query->rowCount();


}
$lastemptpecode=$i;

/////////////// END DEFAULT EMPLOYEETYPE CODE//////////////////


/////////////// START DEFAULT DOCUMENT CODE//////////////////

$lastdoctypcode=0;
$doctype =array('Passport');

for($i=0; $i< count($doctype); $i++)
{
$v ="";
$k=0;
$k=$i+1;
$v = 'DOC0000'.$k;


$sql1="INSERT INTO DocumentMaster (Name, Code, DocType, OrganizationId, CreatedDate, LastModifiedDate) VALUES (?, ?,?, ?, ?, ?)";

$query = $this->db->prepare($sql1);
$query->execute(array($doctype[$i],$v,1, $orgid1, $mdate, $mdate));
$count =  $query->rowCount();




}
$lastdoctypcode=$i;

/////////////// END DEFAULT DOCUMENT CODE//////////////////

/////////////// START DEFAULT TURNOVER REASON CODE//////////////////


$offboardtype =array('Resignation','Termination','Absconding','Others');

for($i=0; $i< count($offboardtype); $i++)
{

if($offboardtype[$i]=='Resignation')
{
$desccat=array('Job Dis-satisfaction','Relocation/Migration','Personal (Health, Family)','Better Prospects');
for($j=0; $j< count($desccat); $j++)
{
$value=0;
$sql1 = "SELECT Value FROM TurnoverReason WHERE  OrganizationId=? order by Value desc limit 1";
$query1= $this->db->prepare($sql1);
$query1->execute(array($orgid1));
$count1=$query1->rowCount();
if($count1>=1){
$row=$query1->fetch();
$value=($row->Value + 1);
}
$sql = "INSERT INTO TurnoverReason (Severancetype, Resaon, Value, OrganizationId, CreatedDate, LastModifiedDate) VALUES (?, ?, ?, ?, ?,?)";

$query = $this->db->prepare($sql);
$query->execute(array(1, $desccat[$j], $value, $orgid1, $mdate, $mdate));
}
}

if($offboardtype[$i]=='Termination')
{
$desccat=array('Poor Performance','Redundancy','Misconduct & Disciplinary');
for($j=0; $j< count($desccat); $j++)
{
$value=0;
$sql1 = "SELECT Value FROM TurnoverReason WHERE  OrganizationId=? order by Value desc limit 1";
$query1= $this->db->prepare($sql1);
$query1->execute(array($orgid1));
$count1=$query1->rowCount();
if($count1>=1){
$row=$query1->fetch();
$value=($row->Value + 1);
}
$sql = "INSERT INTO TurnoverReason (Severancetype, Resaon, Value, OrganizationId, CreatedDate, LastModifiedDate) VALUES (?, ?, ?, ?, ?,?)";

$query = $this->db->prepare($sql);
$query->execute(array(2, $desccat[$j], $value, $orgid1, $mdate, $mdate));
}
}

if($offboardtype[$i]=='Absconding')
{
$desccat=array('Absconded');
for($j=0; $j< count($desccat); $j++)
{
$value=0;
$sql1 = "SELECT Value FROM TurnoverReason WHERE  OrganizationId=? order by Value desc limit 1";
$query1= $this->db->prepare($sql1);
$query1->execute(array($orgid1));
$count1=$query1->rowCount();
if($count1>=1){
$row=$query1->fetch();
$value=($row->Value + 1);
}
$sql = "INSERT INTO TurnoverReason (Severancetype, Resaon, Value, OrganizationId, CreatedDate, LastModifiedDate) VALUES (?, ?, ?, ?, ?,?)";

$query = $this->db->prepare($sql);
$query->execute(array(3, $desccat[$j], $value, $orgid1, $mdate,$mdate));
}
}

if($offboardtype[$i]=='Others')
{
$desccat=array('Contract Completion');
for($j=0; $j< count($desccat); $j++)
{
$value=0;
$sql1 = "SELECT Value FROM TurnoverReason WHERE  OrganizationId=? order by Value desc limit 1";
$query1= $this->db->prepare($sql1);
$query1->execute(array($orgid1));
$count1=$query1->rowCount();
if($count1>=1){
$row=$query1->fetch();
$value=($row->Value + 1);
}
$sql = "INSERT INTO TurnoverReason (Severancetype, Resaon, Value, OrganizationId, CreatedDate, LastModifiedDate) VALUES (?, ?, ?, ?, ?,?)";

$query = $this->db->prepare($sql);
$query->execute(array(4, $desccat[$j], $value, $orgid1, $mdate, $mdate));
}
}
}


/////////////// END DEFAULT TURNOVER REASON CODE//////////////////

///////////////START DEFAULT QUALIFICATION//////////////////

$lastqualcode=0;
$qualificat =array('Bachelors','Diploma','Masters');

for($i=0; $i< count($qualificat); $i++)
{


$v ="";
$k=0;
$k=$i+1;
$v = 'QUA0000'.$k;

$sql1="INSERT INTO CategoryMaster(Name, OrganizationId , CreatedDate,TypeId, LastModifiedDate) VALUES (:policies,:orgid,:cdate,:typeid, :mdate)";

$query = $this->db->prepare($sql1);
$query->execute(array(':policies' =>$qualificat[$i],':orgid' =>$orgid1, ':cdate' => $mdate ,':typeid'=>'3' ,'mdate'=>$mdate ));
$count =  $query->rowCount();
$qualificatid = $this->db->lastInsertId();

if($qualificat[$i]=='Bachelors')
{
$desccat=array('BCA','BCOM','BE','BTECH');
for($j=0; $j< count($desccat); $j++)
{
$sql2="INSERT INTO QualificationTable(Name, CategoryId, Code, OrganizationId, CreatedDate,LastModifiedDate) VALUES (:desccat,:catid,:cod,:orgid,:cdate,:mdate)";

$query2 = $this->db->prepare($sql2);
$query2->execute(array(':desccat' =>$desccat[$j],':catid'=>$qualificatid,':cod'=>$v,':orgid' =>$orgid1, ':cdate' => $mdate, ':mdate' => $mdate ));
}
}

if($qualificat[$i]=='Masters')
{
$desccat=array('MCA','MCOM','MBA','MTECH');
for($j=0; $j< count($desccat); $j++)
{
$sql2="INSERT INTO QualificationTable(Name, CategoryId, Code, OrganizationId, CreatedDate,LastModifiedDate) VALUES (:desccat,:catid,:cod,:orgid,:cdate,:mdate)";

$query2 = $this->db->prepare($sql2);
$query2->execute(array(':desccat' =>$desccat[$j],':catid'=>$qualificatid,':cod'=>$v,':orgid' =>$orgid1, ':cdate' => $mdate , ':mdate' => $mdate));
}
}





}
$lastqualcode=$i;
/////////////// END DEFAULT QUALIFICATION//////////////////







//////////////DEFAULT GRADES//////////////////
$lastgradecode=0;
$grade =array('Top Management','Middle Management','Junior Management');
for($i=0; $i< count($grade); $i++)
{
$v ="";
$k=0;
$k=$i+1;
$v = 'GRA0000'.$k;
$sql1="INSERT iNTO GradeMaster(Name, OrganizationId , CreatedDate,GradeLevel,Code, LastModifiedDate) VALUES (:grade,:orgid,:cdate,1,:code ,:mdate)";

$query = $this->db->prepare($sql1);
$query->execute(array(':grade' =>$grade[$i],':orgid' =>$orgid1, ':cdate' => $mdate,':code' => $v,':mdate' => $mdate));

}
$lastgradecode=$i;
$sql1="INSERT INTO DefaultSequenceCode( OrganizationId,DivisionCode,DepartmentCode,DesignationCode , GradeCode,BankCode,EmpTypeCode,QualCode,DocumentCode, CreatedDate,LastModifiedDate) VALUES (:orgid,:divc,:deptc,:desigc,:gradec,:bancod,:emptyp,:quacod,:doccod,:cdate,:ldate)";
   $query = $this->db->prepare($sql1);
$query->execute(array(':orgid' =>$orgid1,':divc' => 1 ,':deptc' => $lastdeptcode,':desigc' =>  $lastdesicode,':gradec' => $lastgradecode,':bancod'=>$lastbankcode,':emptyp'=>$lastemptpecode,':quacod'=>$lastqualcode,':doccod'=>$lastdoctypcode,':cdate' => $mdate,':ldate' => $mdate));

/* $sql1="INSERT iNTO GradeMaster(Name, OrganizationId , CreatedDate,GradeLevel) VALUES ('Middle Management',:orgid,:cdate,2)";

$query = $this->db->prepare($sql1);
$query->execute(array(':orgid' =>$orgid1, ':cdate' => $mdate));
$sql1="INSERT iNTO GradeMaster(Name, OrganizationId , CreatedDate,GradeLevel) VALUES ('Junior Management',:orgid,:cdate,3)";

$query = $this->db->prepare($sql1);
$query->execute(array(':orgid' =>$orgid1, ':cdate' => $mdate)); */

///////////add salary checklist from here/////////
$sql1 = "SELECT * FROM ChecklistMaster WHERE OrganizationId = ?  ";
$query1 = $this->db->prepare($sql1);
$query1->execute(array($orgid1));
$count1 =  $query1->rowCount();

if( $count1 == 0){
$sql1 = "SELECT * FROM SalaryCheckList ";
$query1 = $this->db->prepare($sql1);
$query1->execute();

while($rows=$query1->fetch()) {
$sql = "INSERT INTO ChecklistMaster (CategoryId, Name, OrganizationId,CreatedDate) VALUES (?,?,?,?)";
$query = $this->db->prepare($sql);
$query->execute(array(3 , $rows->Name, $orgid1, $mdate));

}
}
///////////////DEFAULT LEAVE TYPE///////////////////
$sql1="select * from LeaveMaster where  OrganizationId = $orgid1 ";
$query1=$this->db->prepare($sql1);
$query1->execute();
$count1=$query1->rowCount();
$date = date("Y-m-d");
if( $count1 == 0){
$sql="INSERT INTO `LeaveMaster`(`Name`, `LeaveDays`, `fiscal_id`, `LeaveUsableSts`, `LeaveColor`,  `OrganizationId`, `CreatedDate`,  `LastModifiedDate`, `LeavePayRule`,  `LeaveApply`,  `VisibleSts`,  `Period`,`Caping`) VALUES ('Casual leave', 12, 0, 1, 'rgba(0,29,244,1)', $orgid1, '$mdate', '$mdate', 1, '$date', 1, 2,0) ";
$query=$this->db->prepare($sql);
$query->execute();
$count1=$query->rowCount();
}
///////////////DEFAULT EMPLOYMENT TYPE///////////////////
$sql1="select * from EmploymentTypeMaster where  OrganizationId = $orgid1 ";
$query1=$this->db->prepare($sql1);
$query1->execute();
$count1=$query1->rowCount();
$date = date("Y-m-d");
if( $count1 == 0){
$sql="INSERT INTO `EmploymentTypeMaster`( `Name`, `OrganizationId`, `CreatedDate`,  `LastModifiedDate`) VALUES (?,?,?,?) ";
$query=$this->db->prepare($sql);
$query->execute(array("Part Time" ,$orgid1, $mdate, $mdate));
$count1=$query->rowCount();
$sql="INSERT INTO `EmploymentTypeMaster`( `Name`, `OrganizationId`, `CreatedDate`,  `LastModifiedDate`) VALUES (?,?,?,?) ";
$query=$this->db->prepare($sql);
$query->execute(array("Full Time" ,$orgid1, $mdate, $mdate));
$count1=$query->rowCount();

}
///////////////////////////////////////////////
}
else {
$status=false;
$errorMsg="There is some problem";
}
}



/* $sql="SELECT * FROM DesignationMaster WHERE Id=:desid";
$query = $this->db->prepare($sql);
$query->execute(array(':desid' =>$desid)); */
$res=array();
//$row = $query->fetch();
$res['orgid']=$orgid1;
$res['division_id']=$divisionid;
$res['shift']=$shiftid;
$res['designationid']=$desid ;
$res['departmentid']=$departid ;
// $res['desname']=$row->Name;
//$res['id']=$row->Id;
$data[]=$res;
}


    if ($count2 == 1) {
$status=true;
$successMsg="Data Added Successfully";
    } else {
       $status=false;
$errorMsg="There is some problem";
    }
    // default return

}else{
$isuserexist=true;
}
}else{
$isuserexist=true;
}
$result['data']=$data;
$result['status']=$status;
$result['isuserexist']=$isuserexist;
$result['successMsg']=$successMsg;
$result['errorMsg']=$errorMsg;
$result['emp_code']=$division_code.date('y',strtotime($mdate));
//$result['division_id']=$divisionid;
//$result['shift']=$shiftid;

    return $result;
}
