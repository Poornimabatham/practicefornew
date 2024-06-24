public function getDetail()
    {
        $result = array(); $data = array(); $data1 = array(); $data2 = array();
        $count=0; $errorMsg=""; $successMsg=""; $status=false;
        $preCFleave=0; $totalcreditleave=0; $allocatedleave=0; $expiry_date="";
    
        $hrsts=1;
        $orgid =isset($_REQUEST['orgid'])?$_REQUEST['orgid']:'0';
        $id = isset($_REQUEST['leaveid'])?$_REQUEST['leaveid']:'0';
        // $preyearfiscalid = Utils::getPreviousyearFiscalId($orgid, $this->db);
		
        try{
            $sql = "SELECT *,(SELECT if(LastName!='NULL', CONCAT(FirstName,' ',LastName),FirstName) FROM EmployeeMaster where Id=EmployeeId) as EmployeeName, (SELECT Name FROM LeaveMaster where Id=LeaveTypeId) as LeaveName, (SELECT compoffsts FROM LeaveMaster where Id=LeaveTypeId) as CompOffSts, (SELECT if(LastName!='NULL', CONCAT(FirstName,' ',LastName),FirstName) FROM EmployeeMaster where Id=SubstituteEmployeeId) as SubstituteName FROM EmployeeLeave WHERE Id = $id";
            $query = $this->db->prepare($sql);
            $query->execute();
            $count =  $query->rowCount();
         
            if($count>=1)
            {
                $status=true;
                $successMsg=$count." record found";
                while($row = $query->fetch())
                {
                    $res = array();
                    $res['employee']        = $empid = $row->EmployeeId;
                    $res['employeeid']      = $row->EmployeeName;
                    $res['leavetypeid']     = $leavetypeId = $row->LeaveTypeId;
                    $res['leavetype']       = $row->LeaveName;
                    $res['CompOffSts']      = $CompOffSts = $row->CompOffSts;
                    $res['applydate']       = date("d-m-Y", strtotime($row->ApplyDate));
                    $res['fromdate']        = date("d-m-Y", strtotime($row->LeaveFrom));
                    $res['todate']          = date("d-m-Y", strtotime($row->LeaveTo));
                    $res['fromdaytype']     = $fromtype = $row->FromDayType;
                    $res['todaytype']       = $totype = $row->ToDayType;
                    $res['timeoffrom']      = $row->TimeOfFrom;
                    $res['timeofto']        = $timeofto = $row->TimeOfTo;
                    $res['leavebreakdown']  = $row->LeaveBreakDown;
                    $res['leavereason']     = $row->LeaveReason;
                    $res['leavestatus']     = $row->LeaveStatus;
                    $res['leavevalidsts']   = $row->LeaveValidDays;
                    $res['resumptiondate']  = date("d-m-Y", strtotime($row->ResumptionDate));
                    $res['substituteid']    = $row->SubstituteName;
                    $res['approvedby']      = $row->ApprovedBy;
                    $res['approvercomment'] = $row->ApproverComment;
                    $res['hrsts']           = $hrsts;
                    $res['fromdate1']       = $fromdate = $row->LeaveFrom;
                    $res['todate1']         = $toDate = $row->LeaveTo;
					
					$fiscalid = $this->getFiscalId($row->LeaveFrom, $orgid);
					
					$preyearfiscalid = $this->getPreviousyearFiscalId($orgid, $this->db, $fiscalid);
                    $ ProvisionPeriod= '';
                    $doj = '';
					
					$sqlqy = "SELECT ProvisionPeriod,DOJ,DateOfRejoining FROM EmployeeMaster WHERE OrganizationId = $orgid and Id =$empid ";
					$sqquery = $this->db->prepare($sqlqy);
					$sqquery->execute(array());
					
					if($row41 = $sqquery->fetch()){
						$ProvisionPeriod=$row41->ProvisionPeriod;
						$doj=$row41->DOJ;
						$redoj=$row41->DateOfRejoining;
						if($redoj!='0000-00-00'){
						$doj=$redoj;      
						}
					}
				
                    $date1 = date("Y-m-d", strtotime("+".$ProvisionPeriod." month ".date($doj)));
                    $currdate = date("Y-m-d");
					
                    $startdate=$actualstartdate= $this->getName1($fiscalid,'FiscalMaster','StartDate');
					$enddate=$actualenddate= $this->getName1($fiscalid,'FiscalMaster','EndDate');
					$Expiry_month1="";
					$Expiry_month2="";
					$Expiry_month3="";
					$Expiry_month="";
                    $sql = "SELECT * FROM LeaveMaster WHERE OrganizationId=$orgid and Id = $leavetypeId and LeaveApply <= CURDATE()";
                    $query = $this->db->prepare($sql);
                    $query->execute(array());
                    $count4 =  $query->rowCount();
                    $row4 = $query->fetch();
                    if($count4>=1)
                    {
						$ countOfLeaveList =  
						$leavename=$row4->Name;
                        $leavealotted=$row4->LeaveDays;
                        $creditleavepermonth=(float)$row4->Monthleave;
                        $CFsts=$row4->carriedforward;
                        $cappingsts=$row4->Caping;
                        $leaveeffectivedate=$row4->LeaveApply;
                        $includeweekoff=$row4->includeweekoff;
                        $startdate1=$startdate;
						$dojDocsts = $row4->DateSts;
						$Expiry_month = $row4->Expiry_Month;
						$PaySts = $row4->LeavePayRule;
                        if($row4->Caping==1){
                            $leavealotted=round(($row4->LeaveDays/12),2);
                        }
						
                        // if($CFsts==1){
							// $expiry_date=date("Y-m-d", strtotime($row4->Expiry_date));
                        // }
						if($CFsts ==1)
						{
							$Expiry_month1 = date("Y-m-d", strtotime("+$Expiry_month month", strtotime($startdate)));
                            $Expiry_month2 = date("Y-m-d", strtotime("-1 day", strtotime($Expiry_month1)));
						    $expiry_date= $Expiry_month2;
						}
                        if((strtotime($leaveeffectivedate) >= strtotime($startdate)) &&(strtotime($leaveeffectivedate) < strtotime($enddate)) ){
							
                            if((strtotime($date1) <= strtotime($leaveeffectivedate)) ){
                                if($row4->Caping==1){
                                    $start=date('Y' ,strtotime($leaveeffectivedate));
                                    $end = date('Y' , strtotime($enddate));
                                    $Y1=date('m',strtotime($leaveeffectivedate));
                                    $M1=date('m',strtotime($enddate));
                                    $diff1 = (($end - $start) * 12) + ($M1 - $Y1);
                                    $leavealotted1=($diff1+1) * $leavealotted;
                                    
                                    $countmonth=date('Y' ,strtotime($leaveeffectivedate));
                                    $currentdate = date('Y' , strtotime(date("Y-m-d")));
                                    $Y=date('m',strtotime($leaveeffectivedate));
                                    $M=date('m',strtotime(date("Y-m-d")));
                                    $diff = (($currentdate - $countmonth) * 12) + ($M - $Y);
                                    $totalcreditleave=($diff+1) * $creditleavepermonth;
                                }else{
                                    $start = strtotime($leaveeffectivedate);
                                    $end = strtotime($enddate);
                                    $days_between = (abs($end - $start) / 86400)+1;
                                    $leavealotted1=round(($days_between * $leavealotted)/365);
                                    $totalcreditleave=$leavealotted1;
                                }
                            }else{
                                if($row4->ProbationSts==1){
                                    if((strtotime($doj) <= strtotime($leaveeffectivedate)) ){
                                        if($row4->Caping==1){
                                            $start=date('Y' ,strtotime($leaveeffectivedate));
                                            $end = date('Y' , strtotime($enddate));
                                            $Y1=date('m',strtotime($leaveeffectivedate));
                                            $M1=date('m',strtotime($enddate));
                                            $diff1 = (($end - $start) * 12) + ($M1 - $Y1);
                                            $leavealotted1=($diff1+1) * $leavealotted;
                                            
                                            $countmonth=date('Y' ,strtotime($leaveeffectivedate));
                                            $currentdate = date('Y' , strtotime(date("Y-m-d")));
                                            $Y=date('m',strtotime($leaveeffectivedate));
                                            $M=date('m',strtotime(date("Y-m-d")));
                                            $diff = (($currentdate - $countmonth) * 12) + ($M - $Y);
                                            $totalcreditleave=($diff+1) * $creditleavepermonth;
											
                                        }else{
                                            $start = strtotime($leaveeffectivedate);
                                            $end = strtotime($enddate);
                                            $days_between = (abs($end - $start) / 86400)+1;
                                            $leavealotted1=round(($days_between * $leavealotted)/365);
                                            
                                            $totalcreditleave=$leavealotted1;

                                        }
                                    }else{
										if($row4->ProratedSts==1){
											if($row4->Caping==1){
												$start=date('Y' ,strtotime($doj));
												$end = date('Y' , strtotime($enddate));
												$Y1=date('m',strtotime($doj));
												$M1=date('m',strtotime($enddate));
												$diff1 = (($end - $start) * 12) + ($M1 - $Y1);
												$leavealotted1=round(($diff1+1) * $leavealotted);
												
												$countmonth=date('Y' ,strtotime($doj));
												$currentdate = date('Y' , strtotime(date("Y-m-d")));
												$Y=date('m',strtotime($doj));
												$M=date('m',strtotime(date("Y-m-d")));
												$diff = (($currentdate - $countmonth) * 12) + ($M - $Y);
												$totalcreditleave=($diff+1) * $creditleavepermonth;
											}else{
												$start = strtotime($doj);
												$end = strtotime($enddate);
												$days_between = (abs($end - $start) / 86400)+1;
												$leavealotted1=round(($days_between * $leavealotted)/365);
												$totalcreditleave=$leavealotted1;
												
											}
										}else{
											if($row4->Caping==1){
												$start=date('Y' ,strtotime($leaveeffectivedate));
												$end = date('Y' , strtotime($enddate));
												$Y1=date('m',strtotime($leaveeffectivedate));
												$M1=date('m',strtotime($enddate));
												$diff1 = (($end - $start) * 12) + ($M1 - $Y1);
												$leavealotted1=($diff1+1) * $leavealotted;
												
												$countmonth=date('Y' ,strtotime($leaveeffectivedate));
												$currentdate = date('Y' , strtotime(date("Y-m-d")));
												// $Y=date('m',strtotime($doj));
												$Y=date('m',strtotime($leaveeffectivedate));
												$M=date('m',strtotime(date("Y-m-d")));
												$diff = (($currentdate - $countmonth) * 12) + ($M - $Y);
												$totalcreditleave=($diff+1) * $creditleavepermonth;
											}else{
												
												$start = strtotime($leaveeffectivedate);
												$end = strtotime($enddate);
												$days_between = (abs($end - $start) / 86400)+1;
												$leavealotted1=round(($days_between * $leavealotted)/365);
												$totalcreditleave=$leavealotted1;

											}
										}
                                    }
                                }else{
									if($dojDocsts ==0){
									$start_date =$doj;
										if($doj<$leaveeffectivedate)
										{
											$start_date =$leaveeffectivedate;
										}
									}
									else if($dojDocsts ==2)
									{
										$start_date =$leaveeffectivedate;
									}else{
			  
										$start_date =$date1;		
										
									}
                                    if($row4->Caping==1){
                                        $start=date('Y' ,strtotime($start_date));
                                        $end = date('Y' , strtotime($enddate));
                                        $Y1=date('m',strtotime($start_date));
                                        $M1=date('m',strtotime($enddate));
                                        $diff1 = (($end - $start) * 12) + ($M1 - $Y1);
                                        $leavealotted1=($diff1+1) * $leavealotted;
                                        
                                        $countmonth=date('Y' ,strtotime($start_date));
                                        $currentdate = date('Y' , strtotime(date("Y-m-d")));
                                        $Y=date('m',strtotime($start_date));
                                        $M=date('m',strtotime(date("Y-m-d")));
                                        $diff = (($currentdate - $countmonth) * 12) + ($M - $Y);
                                        $totalcreditleave=($diff+1) * $creditleavepermonth;
                                    }else{
                                        $start = strtotime($start_date);
										$end = strtotime($enddate);
										$days_between = (abs($end - $start) / 86400)+1;
										$leavealotted1=round(($days_between * $leavealotted)/365);
										$totalcreditleave=$leavealotted1;
										
                                    }
                                }
                            }
                        }
                        if(strtotime($leaveeffectivedate) < strtotime($startdate)){
                            if((strtotime($date1) < strtotime($startdate1)) ){
                                if($row4->Caping==1){
                                    $start=date('Y' ,strtotime($startdate1));
                                    $end = date('Y' , strtotime($enddate));
                                    $Y1=date('m',strtotime($startdate1));
                                    $M1=date('m',strtotime($enddate));
                                    $diff1 = (($end - $start) * 12) + ($M1 - $Y1);
                                    $leavealotted1=($diff1+1) * $leavealotted;
                                    
                                    $countmonth=date('Y' ,strtotime($startdate1));
                                    $currentdate = date('Y' , strtotime(date("Y-m-d")));
                                    $Y=date('m',strtotime($startdate1));
                                    $M=date('m',strtotime(date("Y-m-d")));
                                    $diff = (($currentdate - $countmonth) * 12) + ($M - $Y);
                                    $totalcreditleave=($diff+1) * $creditleavepermonth;
                                }else{
                                    $start = strtotime($startdate1);
                                    $end = strtotime($enddate);
                                    $days_between = (abs($end - $start) / 86400)+1;
                                    $leavealotted1=round(($days_between * $leavealotted)/365);
                                    $totalcreditleave=$leavealotted1;
                                }
                            }else{
                                if($row4->ProbationSts==1){
                                    if(strtotime($doj) < strtotime($startdate) ){
                                        if($row4->Caping==1){
                                            $start=date('Y' ,strtotime($startdate1));
                                            $end = date('Y' , strtotime($enddate));
                                            $Y1=date('m',strtotime($startdate1));
                                            $M1=date('m',strtotime($enddate));
                                            $diff1 = (($end - $start) * 12) + ($M1 - $Y1);
                                            $leavealotted1=($diff1+1) * $leavealotted;
                                            
                                            $countmonth=date('Y' ,strtotime($startdate1));
                                            $currentdate = date('Y' , strtotime(date("Y-m-d")));
                                            $Y=date('m',strtotime($startdate1));
                                            $M=date('m',strtotime(date("Y-m-d")));
                                            $diff = (($currentdate - $countmonth) * 12) + ($M - $Y);
                                            $totalcreditleave=($diff+1) * $creditleavepermonth;
                                        }else{
                                            $start = strtotime($startdate1);
                                            $end = strtotime($enddate);
                                            $days_between = (abs($end - $start) / 86400)+1;
                                            $leavealotted1=round(($days_between * $leavealotted)/365);
                                            
                                            $totalcreditleave=$leavealotted1;
                                        }
                                    }
                                    
                                    if(strtotime($doj) >= strtotime($startdate)){
										if($row4->ProratedSts==1){
											if($row4->Caping==1){
												$start=date('Y' ,strtotime($doj));
												$end = date('Y' , strtotime($enddate));
												$Y1=date('m',strtotime($doj));
												$M1=date('m',strtotime($enddate));
												$diff1 = (($end - $start) * 12) + ($M1 - $Y1);
												$leavealotted1=($diff1+1) * $leavealotted;
												
												$countmonth=date('Y' ,strtotime($doj));
												$currentdate = date('Y' , strtotime(date("Y-m-d")));
												$Y=date('m',strtotime($doj));
												$M=date('m',strtotime(date("Y-m-d")));
												$diff = (($currentdate - $countmonth) * 12) + ($M - $Y);
												$totalcreditleave=($diff+1) * $creditleavepermonth;
											}else{
												$start = strtotime($doj);
												$end = strtotime($enddate);
												$days_between = (abs($end - $start) / 86400)+1;
												$leavealotted1=round(($days_between * $leavealotted)/365);
												
												$totalcreditleave=$leavealotted1;
												
												if($Proratedeffective==1){
													$countmonth=date('Y' ,strtotime($doj));
													$currentdate = date('Y' , strtotime(date($enddate)));
													$Y=date('m',strtotime($doj));
													$M=date('m',strtotime(date($enddate)));
													$diff = (($currentdate - $countmonth) * 12) + ($M - $Y);
													$leavealotted1 = round((($diff+1) * ($leavealotted/12)),2);
													
													$totalcreditleave = $leavealotted1;
												}
											}
										}else{
											if($row4->Caping==1){
												$start=date('Y' ,strtotime($startdate));
												$end = date('Y' , strtotime($enddate));
												$Y1=date('m',strtotime($startdate));
												$M1=date('m',strtotime($enddate));
												$diff1 = (($end - $start) * 12) + ($M1 - $Y1);
												$leavealotted1=($diff1+1) * $leavealotted;
												
												$countmonth=date('Y' ,strtotime($startdate));
												$currentdate = date('Y' , strtotime(date("Y-m-d")));
												$Y=date('m',strtotime($startdate));
												$M=date('m',strtotime(date("Y-m-d")));
												$diff = (($currentdate - $countmonth) * 12) + ($M - $Y);
												$totalcreditleave=($diff+1) * $creditleavepermonth;
											}else{
												$start = strtotime($startdate);
												$end = strtotime($enddate);
												$days_between = (abs($end - $start) / 86400)+1;
												$leavealotted1=round(($days_between * $leavealotted)/365);
												
												$totalcreditleave=$leavealotted1;
											}
										}
                                    }
                                }else{
									if($dojDocsts ==0){
										$start_date =$doj;
										if($doj <= $startdate){
											$start_date =$startdate;

										}else{
											$start_date =$doj;
										}
									}
									else if($dojDocsts ==2)
									{
										$start_date =$startdate;
									}else{
										$start_date =$date1;
									}
                                    if($row4->Caping==1){
                                        $start=date('Y' ,strtotime($start_date));
                                        $end = date('Y' , strtotime($enddate));
                                        $Y1=date('m',strtotime($start_date));
                                        $M1=date('m',strtotime($enddate));
                                        $diff1 = (($end - $start) * 12) + ($M1 - $Y1);
                                        $leavealotted1=($diff1+1) * $leavealotted;
                                        
                                        $countmonth=date('Y' ,strtotime($start_date));
                                        $currentdate = date('Y' , strtotime(date("Y-m-d")));
                                        // $Y=date('m',strtotime($date1));
										$Y=date('m',strtotime($start_date));
                                        $M=date('m',strtotime(date("Y-m-d")));
                                        $diff = (($currentdate - $countmonth) * 12) + ($M - $Y);
                                        $totalcreditleave=($diff+1) * $creditleavepermonth;
                                    }else{
                                        $start = strtotime($start_date);
                                        $end = strtotime($enddate);
                                        $days_between = (abs($end - $start) / 86400)+1;
                                        $leavealotted1=round((($days_between * $leavealotted)/365),2);
                                        $totalcreditleave=$leavealotted1;
                                    }
                                }
                            }
                        }
                        
						if($row4->Caping==1 && $enddate < date('Y-m-d')){
								$totalcreditleave=$leavealotted1;
						}
						
                        if($row4->carriedforward==1){
							$CFsts=1;
							$sql1 = "SELECT * FROM EmployeeCarriedForward WHERE OrganizationId = ? and EmployeeId = ?  and FiscalId = ? and LeaveTypeId=?";
							$query1 = $this->db->prepare($sql1);
							$query1->execute(array($orgid,$empid,$preyearfiscalid,$leavetypeId));
							$count1 =  $query1->rowCount();
							$row1 = $query1->fetch();
							
							if($count1>=1){
							$preCFleave=$row1->CFLeave;	
							}
						}
                    
                        $employeeusedleave=0;
						$sql2 = "Select * from EmployeeLeaveChild as empchild,EmployeeLeave as empleave where empchild.EmployeeLeaveId=empleave.Id and empleave.OrganizationId = $orgid and empleave.EmployeeId =$empid and empleave.LeaveTypeId=$leavetypeId and empleave.FiscalId=$fiscalid and empchild.LossOfPay=0 and empleave.LeaveStatus=2 and empchild.Entitled=1";
						$query2 = $this->db->prepare($sql2);
						$query2->execute(array());
                        $count2 = $query2->rowCount();
                        while($row2 = $query2->fetch()){
							if($row2->HalfDaySts == 1){
								$employeeusedleave = $employeeusedleave + 0.5;
							}
							else{
								$employeeusedleave++;
							}
						}
                        $cfrleave=0;
                        $countweekdays=0;
                        $CFleaves=0;
                        $carrforwardcount=0;
						$lapsecf=0;
                        $sql3 = "Select * from EmployeeLeaveChild as empchild,EmployeeLeave as empleave where empchild.EmployeeLeaveId=empleave.Id and empchild.LossOfPay=0 and empchild.LeaveStatus=2  and empleave.OrganizationId = ? and empleave.EmployeeId =?  and empleave.LeaveTypeId=? and empleave.LeaveStatus=2 and empchild.CarriedForward=1 and empleave.FiscalId=?";
						$query3 = $this->db->prepare($sql3);
						$query3->execute(array($orgid,$empid,$leavetypeId,$fiscalid));
						while($row3 = $query3->fetch()){
							if($row3->HalfDaySts == 1){
								$cfrleave = $cfrleave + 0.5;
							}
							else{
								$cfrleave++;
							}
						}
						
						if($expiry_date != ""){
							if(strtotime($expiry_date) < strtotime(date('Y-m-d'))){
								$lapsecf = $preCFleave - $cfrleave;
							}
						}

                        $totalutilizedleave=$employeeusedleave + $cfrleave;
						$leftalloted=$totalcreditleave-$employeeusedleave;
						 
                        if($leftalloted>0)
                          $balanceleave=(($preCFleave-$cfrleave) + $leftalloted);
                        $status=true;
                        $successMsg='record found';
                        $res1 = array();
						
                        $res1['CompOffSts']=(int)$CompOffSts;
                        $res1['CFsts']=(int)$CFsts;
                        $res1['cappingsts']=(int)$cappingsts;
                        $res1['includeweekoff']=(int)$includeweekoff;
                        $res1['CFleave']=$this->getLeaveTypeRoundOff($preCFleave);
                        $res1['allotedleave']=$this->getLeaveTypeRoundOff(round($leavealotted1,2));
                        $res1['totalleave']= $this->getLeaveTypeRoundOff($preCFleave + round($leavealotted1,2));
                        $res1['totalCreditedleave']=$this->getLeaveTypeRoundOff(round($totalcreditleave, 2));
                        $res1['utilizedleave']=$this->getLeaveTypeRoundOff($totalutilizedleave);
                        $res1['CF1']=$this->getLeaveTypeRoundOff($cfrleave);
                        $res1['AL1']=$this->getLeaveTypeRoundOff($employeeusedleave);
						$res1['Lapsecf']=$this->getLeaveTypeRoundOff($lapsecf);
                        $res1['allocatedleftleaves']=$leftallocated = $this->getLeaveTypeRoundOff(round($leftalloted,2));
                        // $res1['balanceleave']=$balanceleaves=($preCFleave - $cfrleave) + ($totalcreditleave - $employeeusedleave);
						
						$balanceleaves=round((($preCFleave - $cfrleave) + ($totalcreditleave - $employeeusedleave) - $lapsecf),2);
						if($balanceleaves>=floor($balanceleaves) && $balanceleaves<=floor($balanceleaves)+0.49)
						{
							$res1['balanceleave']= $this->getLeaveTypeRoundOff(floor($balanceleaves));
						}
						else{
							$res1['balanceleave']=$this->getLeaveTypeRoundOff(floor($balanceleaves)+0.5);
						}
						
                        $res1['PreCF']=$this->getLeaveTypeRoundOff(($preCFleave - $cfrleave) - $lapsecf);
                        $res1['leftAL']=$this->getLeaveTypeRoundOff(round(($totalcreditleave -$employeeusedleave),2));
						$res1['name']=$leavename;
						//$res1['expiry_date']=$expiry_date;
						if($expiry_date != "")
						{
							$res1['expiry_date'] =  date("m/d/Y", strtotime($expiry_date));
							$res1['expiry_date1'] =  date("d/m/Y", strtotime($expiry_date));
						}
							
						
                        ///////////////////CARRIED FORWARD / PAID / LOSS OF PAY CACLCULATION/////////////////
                        $leavearr=array();$empleavedetail=array();
                        $leavearr=$this->getLeaveDaysDifference($empid,$fromdate,$toDate,$fromtype,$totype,$leavetypeId,$timeofto,$orgid);
						//print_r($leavearr);
                        $res1['leavedays']=$dayseligible=$leavearr['totaldays'];
                        $resumptiondate=$leavearr['resumptiondate'];
                        $empleavedetail=$leavearr['data'];
						//print_r($empleavedetail);
            
                        $date1=date_create(".$fromdate.");
                        $date2=date_create(".$expiry_date.");
                        $diff=date_diff($date1,$date2);
                        $daysDiff=$diff->format("%a");
                    
                        $countweekdays=0;
                        $carrforwardcount = $preCFleave - $cfrleave;
                        $CFleaves= 0;
						
                        for($i=0;$i<count($empleavedetail);$i++){
                            $date="";
                            $date=date('Y-m-d',strtotime($empleavedetail[$i]['date1']));
							if($includeweekoff==1){
								if($date<=$expiry_date){
									if($empleavedetail[$i]['sts'] == 2){
										$countweekdays=$countweekdays+0.5 ;
									}else{
										$countweekdays++;
									}
								}
							}else{
								if(($date<=$expiry_date) && ($empleavedetail[$i]['sts'] == 1 || $empleavedetail[$i]['sts'] == 2)){
									if($empleavedetail[$i]['sts'] == 2){
										$countweekdays=$countweekdays+0.5;
									}else{
										$countweekdays++;
									}
								}
							}
                        }
            
                        if($carrforwardcount==0){
                           $CFleaves=0;
                        }else{
                            if($fromdate > $expiry_date){
                                $CFleaves=0;
                            }else{
                                if($fromdate > $expiry_date && $toDate > $expiry_date){
                                    $CFleaves=0;
                                }else if(($fromdate <= $expiry_date) && ($toDate > $expiry_date)){
									if(($daysDiff+1) >= $carrforwardcount){
                                       if($countweekdays >=$carrforwardcount){
                                           $CFleaves= $carrforwardcount;
                                       }else{
                                           $CFleaves= $countweekdays;
                                       }
                                    }else{
                                        if($fromtype==2){
                                            $CFleaves= $daysDiff +0.5;
                                        }else{
                                            $CFleaves= $daysDiff +1;
                                        }
                                    }
                                }else if(($fromdate <= $expiry_date) && ($toDate <= $expiry_date)){
                                    if($daysDiff >= $carrforwardcount){
                                        $CFleaves= $carrforwardcount;
                                    }else{
                                        $CFleaves= $daysDiff+1;
                                    }
                                }
                            }
                        }
						
						$cf = (int)(($CFleaves - (int)($CFleaves))*10);
						if($cf!=0){
							if($cf >= 5){
								$cf = 5;
							}else{
								$cf = 0;
							}
						}
						
						if($cf!=0){ 
							$CFleaves = number_format(((int)($CFleaves).".".$cf),'1','.',''); 
						}else{
							$CFleaves = (int)($CFleaves);
						}
						
						$la = (int)(($leftallocated - (int)($leftallocated))*10);
						if($la!=0){
							if($la >= 5){
								$la = 5;
							}else{
								$la = 0;
							}
						}
						
						if($la!=0){
							$leftallocated = number_format(((int)($leftallocated).".".$la),'1','.',''); 
							
						}else{
							$leftallocated = (int)($leftallocated);
						}
					
						$balanceleaves = $CFleaves + $leftallocated;
						if($PaySts == 0){
							$res1['carryforward'] = $carryforward = 0;
							$res1['entitled']= $entitled = 0;
							$res1['unpaid'] = $unpaid = $dayseligible;
						}else{
							if($dayseligible<=$balanceleaves){ // 1
								$varcfleaves=(int)(($CFleaves*2)%2);
								$varleftallocated=(int)(($leftallocated*2)%2);
								$vardayseligible=(int)(($dayseligible*2)%2);
								$varbalanceleaves=(int)(($balanceleaves*2)%2);
								if($dayseligible<=$CFleaves){ // 1.1
									/* echo '$dayseligible<=$CFleaves';
									echo $dayseligible<=$CFleaves; */
									$res1['carryforward']=$carryforward=$dayseligible;
									$res1['entitled']=$entitled=$dayseligible-$carryforward;
									$res1['unpaid'] = $dayseligible - ($carryforward + $entitled);
								}else{ // 1.2
									/* echo '$dayseligible>$CFleaves';
									echo $dayseligible>$CFleaves; */
									if(($varcfleaves==0) && ($varleftallocated==0)){ //1.2.1
										/* echo '(($varcfleaves==0) && ($varleftallocated==0))';
										echo (($varcfleaves==0) && ($varleftallocated==0)); */
										$res1['carryforward']=$carryforward=$CFleaves;
										$res1['entitled']=$entitled=$dayseligible-$carryforward;
										$res1['unpaid'] = $dayseligible - ($carryforward + $entitled);	
									}
									
									if(($varcfleaves==0) && ($varleftallocated==1)){ //1.2.2
										/* echo '(($varcfleaves==0) && ($varleftallocated==1))';
										echo (($varcfleaves==0) && ($varleftallocated==1)); */
										$res1['carryforward']=$carryforward=$CFleaves;
										$res1['entitled']=$entitled=$dayseligible-$carryforward;
										$res1['unpaid'] = $dayseligible - ($carryforward + $entitled);	
									}
									
									if(($varcfleaves==1) && ($varleftallocated==0)){ //1.2.3
										/* echo '(($varcfleaves==1) && ($varleftallocated==0))';
										echo (($varcfleaves==1) && ($varleftallocated==0)); */
										if($vardayseligible==1){ //1.2.3.1
											/* echo '$vardayseligible if';
											echo $vardayseligible; */
											$res1['carryforward']=$carryforward=$CFleaves;
											$res1['entitled']=$entitled=$dayseligible-$carryforward;
											$res1['unpaid'] = $dayseligible - ($carryforward + $entitled);	
										}else{ //1.2.3.2
											/* echo '$vardayseligible else';
											echo $vardayseligible; */
											$res1['carryforward']=$carryforward=$CFleaves -0.5;
											$res1['entitled']=$entitled=$dayseligible-$carryforward;
											$res1['unpaid'] = $dayseligible - ($carryforward + $entitled);
										}
									}
									
									if(($varcfleaves==1) && ($varleftallocated==1)){ //1.2.4
										/* echo '(($varcfleaves==1) && ($varleftallocated==1))';
										echo (($varcfleaves==1) && ($varleftallocated==1)); */
										if($vardayseligible==1){ //1.2.4.1
											/* echo '$vardayseligible if';
											echo $vardayseligible; */
											$res1['carryforward']=$carryforward=$CFleaves;
											$res1['entitled']=$entitled=$dayseligible-$carryforward;
											$res1['unpaid'] = $dayseligible - ($carryforward + $entitled);
										}else{ //1.2.4.2
											/* echo '$vardayseligible else';
											echo $vardayseligible; */
											$res1['carryforward']=$carryforward=$CFleaves -0.5;
											$paidfromleftalloted = $dayseligible-$carryforward;
											if($paidfromleftalloted<=$leftallocated){ //1.2.4.2.1
												/* echo '($paidfromleftalloted<=$leftallocated)';
												echo ($paidfromleftalloted<=$leftallocated); */
												$res1['entitled']=$entitled=$paidfromleftalloted ;
												$res1['unpaid'] = $dayseligible - ($carryforward + $entitled);
											}else{ //1.2.4.2.2
												/* echo '($paidfromleftalloted>$leftallocated)';
												echo ($paidfromleftalloted>$leftallocated); */
												if($varleftallocated==1){ //1.2.4.2.2.1
													/* echo '$varleftallocated if';
													echo $varleftallocated; */
													$res1['entitled']=$entitled=$leftallocated - 0.5;
													$res1['unpaid'] = $dayseligible - ($carryforward + $entitled);
												}else{ //1.2.4.2.2.2
													/* echo '$varleftallocated else';
													echo $varleftallocated; */
													$res1['entitled']=$entitled=$leftallocated;
													$res1['unpaid'] = $dayseligible - ($carryforward + $entitled);
												}	
											}
										}
									}
								}
							}else{
								$varcfleaves= (int)(($CFleaves*2)%2);
								$varleftallocated= (int)(($leftallocated*2)%2);
								$vardayseligible=(int)(($dayseligible*2)%2);
								$varbalanceleaves=(int)(($balanceleaves*2)%2).'<br>';
								if($varbalanceleaves==1){
									/* echo '$varbalanceleaves==1 ';
									echo $varbalanceleaves;  */
									if(($varcfleaves==0) && ($varleftallocated==1)){
										/* echo '(($varcfleaves==0) && ($varleftallocated==1))';
										echo (($varcfleaves==0) && ($varleftallocated==1));  */
										$res1['carryforward']=$carryforward=$CFleaves;
										if($vardayseligible==1){
											/* echo '$vardayseligible if';
											echo $vardayseligible; */
											$res1['entitled']=$entitled=$leftallocated;
											$res1['unpaid'] = $dayseligible - ($carryforward + $entitled);	
										}else{
											/* echo '$vardayseligible else';
											echo $vardayseligible; */
											$res1['entitled']=$entitled=$leftallocated - 0.5;
											$res1['unpaid'] = $dayseligible - ($carryforward + $entitled);
										}
									}
									
									if(($varcfleaves==1) && ($varleftallocated==0)){
										/* echo '(($varcfleaves==1) && ($varleftallocated==0))';
										echo (($varcfleaves==1) && ($varleftallocated==0)); */
										if($vardayseligible==1){
											/* echo '$vardayseligible if';
											echo $vardayseligible; */
											$res1['carryforward']=$carryforward=$CFleaves;
											$res1['entitled']=$entitled=$leftallocated;
											$res1['unpaid'] =$dayseligible - ($carryforward + $entitled);
										}else{
											/* echo '$vardayseligible else';
											echo $vardayseligible; */
											$res1['carryforward']=$carryforward=$CFleaves - 0.5;
											$res1['entitled']=$entitled=$leftallocated;
											$res1['unpaid'] =$dayseligible - ($carryforward + $entitled);	
										}
									}
								}
								
								if($varbalanceleaves==0){
									/* echo '$varbalanceleaves==0';
									echo $varbalanceleaves; */
									if(($varcfleaves==1) && ($varleftallocated==1)){
										/* echo '(($varcfleaves==1) && ($varleftallocated==1))';
										echo (($varcfleaves==1) && ($varleftallocated==1)); */
										if($vardayseligible==1){
											/* echo '$vardayseligible if';
											echo $vardayseligible; */
											$res1['carryforward']=$carryforward=$CFleaves;
											$res1['entitled']=$entitled=$leftallocated - 0.5;
											$res1['unpaid'] = $dayseligible - ($carryforward + $entitled);	
										}else{
											/* echo '$vardayseligible else';
											echo $vardayseligible; */
											$res1['carryforward']=$carryforward=$CFleaves - 0.5;
											$res1['entitled']=$entitled=$leftallocated - 0.5;
											$res1['unpaid'] = $dayseligible - ($carryforward + $entitled);
										}
									}
									
									if(($varcfleaves==0) && ($varleftallocated==0)){
										/* echo '(($varcfleaves==0) && ($varleftallocated==0))';
										echo (($varcfleaves==0) && ($varleftallocated==0)); */
										$res1['carryforward']=$carryforward=$CFleaves;
										$res1['entitled']=$entitled=$leftallocated;
										$res1['unpaid'] =$dayseligible - ($carryforward + $entitled);	
									}
								}
							}
						}
                        $data1[]=$res1;
                    }
                    
                    $s1="SELECT * from LeaveApproval WHERE OrganizationId=? and LeaveId = ? and ApproverSts<>3";
                    $query = $this->db->prepare($s1);
                    $query->execute(array($orgid, $id));
                    while($row = $query->fetch())
                    {
                        $res = array();
                        $status=true;
                        $res['id'] = $row->Id;
                        $res['name'] = Utils::getEmployeeName($row->ApproverId, $this->db);
                        $res['sts'] = $row->ApproverSts;
                        $res['comment'] = $row->ApproverComment;
                        $res['approvaldate'] = Utils::datetimeformatter($row->ApprovalDate);
                        $data2[] = $res;
                    }
                }
            
                if ($count == 1) {
                   $status =true;
                   $successMsg = "SUCCESS";
                } else {
                   $status =false;
                   $errorMsg = "FAILED";
                }
            }
        }catch(Exception $e) {
            $status = false;
            $errorMsg = 'Message: ' .$e->getMessage();
        }
        
        return $data1;
    }