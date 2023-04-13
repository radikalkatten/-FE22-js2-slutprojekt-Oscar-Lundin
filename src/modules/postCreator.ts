import axios from "axios/lib/axios"
interface FirebaseResponse {
  name: string;
}
export class post {
  private username: string;
  private date: string;
  private message: string;
  private title: string;
  private time: number
  
  constructor(username: string, date: string, message: string, title: string, time:number) {
    this.username = username;
    this.date = date;
    this.message = message
    this.title = title
    this.time = time
  }

  toFirebaseObject(): Record<string | number, string | number> {
    return {
      username: this.username,
      date: this.date,
      message: this.message,
      title: this.title,
      time: this.time
    };
  }

  async saveToFirebase(): Promise<string> {
    const baseUrl = "https://socialmedia-49567-default-rtdb.europe-west1.firebasedatabase.app/posts/"
    const firebaseResponse: FirebaseResponse = await axios.post(
      baseUrl + '.json',
      this.toFirebaseObject()
    );

    return firebaseResponse.name;
  }
}

