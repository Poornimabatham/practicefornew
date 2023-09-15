  interface EarlyCommersInterface {
    name: string;
    timein: string;
    lateby: number;
    shift: string;
    date: string;
    EntryImage: string;
  }

  interface EarlyLeaversInterface {
    name: string;
    timeout: string;
    earlyby: number;
    shift: string;
    date: string;
    EntryImage: string;
  }

  interface getdataforPresenteesInterface{
    latit_in : string;
    longi_in : string;
    latit_out : string;
    longi_out : string;
    Id:number;
    name:string;
    TotalLoggedHours : number;
    AttendanceStatus:number;
    ShiftId: number;
    multitime_sts : number;
    OrganizationId: number;
    AttendanceDate: string;
    getInterimAttAvailableSts: boolean;
    TimeIn:string;
    checkInLoc:string;
    shiftType: number;
    EntryImage:string;
    ExitImage:string;
    status: string;
    TimeOut:string;
  }

  interface getdataforAbsenteesInterface{
    name:string;
    TimeIn:string;
    TimeOut:string;
    LeaveStatus: string;
  }

  interface getdataforLatecomingsInterface{

    latit_in : string;
    longi_in : string;
    latit_out : string;
    longi_out : string;
    Id:number;
    name:string;
    TotalLoggedHours : number;
    AttendanceStatus:number;
    ShiftId: number;
    multitime_sts : number;
    OrganizationId: number;
    AttendanceDate: string;
    TimeIn:string;
    checkInLoc:string;
    shiftType: number;
    EntryImage:string;
    ExitImage:string;
    status: string;
    TimeOut:string;
}
  
  interface getAppDetail {
    appVersion: string;
    updateStatus: string;
    checkMandUpdate: string;
  }  