import axios from "axios/lib/axios"
interface FirebaseResponse {
  name: string;
}
export class User {
  private username: string;
  private email: string;
  private password: string;
  private profileimage: number;
  constructor(username: string, email: string, password: string, profileimage: number) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.profileimage = profileimage
  }

  toFirebaseObject(): Record<string | number, string | number> {
    return {
      username: this.username,
      email: this.email,
      password: this.password,
      img: this.profileimage
    };
  }

  async saveToFirebase(): Promise<string> {
    const baseUrl = "https://socialmedia-49567-default-rtdb.europe-west1.firebasedatabase.app/users/"
    const firebaseResponse: FirebaseResponse = await axios.put(
      baseUrl + this.username + '.json',
      this.toFirebaseObject()
    );

    return firebaseResponse.name;
  }
}
// export function saveToFirebase()
// Usage:
// const myUser = new User('myurname', 'myemail@example.com', 'mypassword', 4);
// const firebaseId = myUser.saveToFirebase();
// console.log(`User saved with Firebase ID: ${firebaseId}`);

