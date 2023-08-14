  interface EarlyCommersInterface {
    FirstName: string;
    LastName: string;
    atimein: string;
    TimeIn: string;
    Earlyby: number;
    EntryImage: string;
  }

  interface EarlyLeaversInterface {
    FirstName: string;
    LastName: string;
    shifttype: number;
    EmployeeId: number;
    ShiftId: number;
    atimein: string;
    TimeOut: string;
    earlyleaver: number;
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