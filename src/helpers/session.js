import firebase from "firebase/app";

// Sets and returns data as JSON object in session
class SessionHelper {
  /**
   *
   * @param {*} key String
   * @param {*} data Object/json
   * Turn data into json-string and set it as key/value pair in session
   */
  set(key, data) {
    try {
      data = JSON.stringify(data);
      sessionStorage.setItem(key, data);
    } catch (e) {
      console.log("Error: " + e);
      throw new Error(
        `Failed to set key: ${key} & data: ${data} to sessionstorage`
      );
    }
  }

  /**
   *
   * @param {*} key
   * Get key/value pair from session, converts it into JSON
   * @returns JSON
   */
  get(key) {
    try {
      let data = sessionStorage.getItem(key);
      return JSON.parse(data);
    } catch (e) {
      console.log("Error: " + e);
      return null;
    }
  }

  /**
   *
   * @param {*} key
   * Check if data is storred in session and if it is older then 20min
   * If current time is more then 20min(1200) laster then lastUpdate @return true;
   * If not @return false
   * If key not found return null
   * // TODO Lägg till så 
   */
  async lastUpdated(key) {
    try {
      let data = sessionStorage.getItem(key);
      if (data === null) {
        return null;
      }
      let serverTimeInSeconds = firebase.firestore.Timestamp.now().seconds;

      if (serverTimeInSeconds - data.lastUpdated > 1200) {
        console.log("more then 20min");
        return false;
      }
      console.log("less then 20 min")
      return true;
    } catch (e) {
      console.log("Error: " + e);
    }
  }

  isSessionDataUpToDate(key, newTime){
    try{
      let data = this.get(key);
      console.log("Session user data:", data);
      if(data.lastUpdated.seconds != newTime && data.lastUpdated.seconds - newTime > 1200){
        return false;
      }
      return true;

    }catch(e){
      console.log("error: ", e);
    }
  }
}

export default SessionHelper;
