import Database from "@ioc:Adonis/Lucid/Database";

export default class saveImageGrpAttFaceService {

  public static async saveImageGrpAttFace(data) {

    let FakeLocationStatusTimeOut = 0;
    let attMasterId = 0;
    let faceid = "";
    let personid = "";
    let confidence = "0";
    let personobj = "0";
    let FirstName = "";
    let statusatt = "0";
    let file = "";
    let successMsg = "";
    let errorMsg = "";
    let flag = "";
    let result: [] = [];
    result['facerecog'] = '';
    result['groupface'] = '';
    result['status'] = ''; //for recently marked attendance
    result['successMsg'] = '';
    result['errorMsg'] = '';

  }
}