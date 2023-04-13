import * as UserCreator from "./UserCreator"
import * as postCreator from "./postCreator"
import axios from "../../node_modules/axios/lib/axios"
import { title } from "process"
// #region buttons
const logInBtn = document.getElementById('logInBtn')
const createFormBtn = document.getElementById('createAcc')
const createFormBtn2 = document.getElementById('createAcc2')
const logInForm = document.getElementById('logInForm')
const loginCreate = document.getElementById('loginCreate')
const createSubmit = document.getElementById('createSubmit')
const loginTryBtn = document.getElementById('loginTryBtn')
const createNewPostBtn = document.getElementById('createNewPost')
const createPostForm  = document.getElementById('createPostForm')
const createPostSubmit = document.getElementById('createPostBtn')
const usersDir = document.getElementById('usersDir')
const welcomeText = document.getElementById('welcomeText')
const profileShow = document.getElementById('profileShow')
const profileh1 = <HTMLTextAreaElement> document.getElementById('profileh1')
const postContainer = <HTMLDivElement>document.getElementById('postContainer')
const contentHolder = <HTMLDivElement>document.getElementById('contentHolder')
const logOutBtn = document.getElementById('logOutBtn')
const loggedinAs = <HTMLTextAreaElement> document.getElementById('loggedInas')
createNewPostBtn?.addEventListener('click', ()=>{createPostForm?.classList.toggle('inactive')})
logInBtn?.addEventListener('click', () =>{logInForm?.classList.toggle('inactive'); loginCreate?.classList.add('inactive')})
createFormBtn?.addEventListener('click', () =>{loginCreate?.classList.toggle('inactive'); logInForm?.classList.add('inactive')})
createFormBtn2?.addEventListener('click', () =>{loginCreate?.classList.remove('inactive'); logInForm?.classList.add('inactive')})
logOutBtn?.addEventListener('click', () => {document.cookie = "username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";  location.reload()})
let currentFeed: string = `${getCookie()}`
// #endregion
// #region inputStuff
const usernameLogin = <HTMLInputElement>document.getElementById('usernameLogin')
const passwordLogin = <HTMLInputElement>document.getElementById('passwordLogin')
const usernameCreate = <HTMLInputElement>document.getElementById('usernameCreate')
const emailCreate = <HTMLInputElement>document.getElementById('emailCreate')
const passwordCreate = <HTMLInputElement>document.getElementById('passwordCreate')
const postMessage = <HTMLInputElement>document.getElementById('msg')
const postTitle = <HTMLInputElement>document.getElementById('nme')
// #endregion
// console.log(input)
createPostSubmit?.addEventListener('click', async (e)=>{
  e.preventDefault()
  const username= getCookie()
  const dateGet = new Date()
  const date = dateGet.toString()
  const time = dateGet.getTime()
  await createPost(postMessage.value, username, postTitle.value, date, time)
  getPost(getCookie())
  createPostForm?.classList.add('inactive')
})
loginTryBtn?.addEventListener('click', async ()=>{
  
  if(await checkLogin(usernameLogin.value, passwordLogin.value) === true){
    setCookie(usernameLogin.value)
    profileShow?.classList.remove('inactive')
    contentHolder?.classList.remove('inactive')
    logInForm?.classList.add('inactive')
    createPostForm?.classList.add('inactive')
    loggedinAs?.classList.remove('inactive')
    createNewPostBtn?.classList.remove('inactive')
    welcomeText?.classList.add('inactive')
    logInBtn?.classList.add('inactive')
    createFormBtn?.classList.add('inactive')
    contentHolder?.classList.remove('inactive')
    logOutBtn?.classList.remove('inactive')
    currentFeed = getCookie()
    checkCurrentProfile(currentFeed)
    getPost(currentFeed)
    loggedinAs.innerText = `Inloggad som: ${currentFeed}`
  }else{
    return
  }
})
createSubmit?.addEventListener('click', ()=>{
  const input = <HTMLInputElement>document.querySelector('input[name="profilePic"]:checked')
  checkUsernameExists(usernameCreate?.value, Number(input.value))
  
})

function checkInputCreate(username:string, email:string, password:string, profile:number): void {
  if(username == "" || email == "" || password == ""){
    alert("please fill out all fields")
  }else{
    console.log(profile)
    let createUser: {saveToFirebase():void} = new UserCreator.User( username, email, password, profile)
    createUser.saveToFirebase()
    loginCreate?.classList.add('inactive')
    logInForm?.classList.remove('inactive')
   
  }
}
async function createPost(message:string, username:string, title:string, date:string, time:number): Promise<void> {
  if(message == "" || title == ""){
    alert("please fill out all fields")
  }else{
    let createUser: {saveToFirebase():void} = new postCreator.post( username, date, message, title, time)
    await createUser.saveToFirebase()
    
  }
}
const checkLogin = async(username:string, password:string):Promise<boolean|undefined> =>{
  try {
    let config = {
      headers:{
        'crossorigin': 'true',
        'Access-Control-Allow-Origin':'true'
      }
    }
    const response = await axios.get(`https://socialmedia-49567-default-rtdb.europe-west1.firebasedatabase.app/users/${username}.json`, config);
    const data = response.data;
    
    if(data == null){
      alert("username does not exist")
      return
    }else{
      if(data.username == username && data.password == password){
        // document.cookie = "username="
        return true
      }else{
        alert("no username with that password exists")
        
        return false
      }
    }
  } catch (error) {
    console.error(error);
  }
}

const getPost = async (username:string): Promise<void> => {
const endpoint = 'https://socialmedia-49567-default-rtdb.europe-west1.firebasedatabase.app/posts/.json';


interface Post {
  date: string;
  message: string;
  time: number;
  title: string;
  username: string;
}
clearPosts()

axios.get(endpoint)
  .then(async(response) => {
    const posts: { [key: string]: Post } = response.data;
    
    
    const filteredPosts = Object.keys(posts)
    .map((key) => ({ id: key, ...posts[key] }))
    .filter((post) => post.username === username);
    if(filteredPosts.length == 0){
      
      const apologyMessage = document.createElement('h1')
      apologyMessage.innerText = `${currentFeed} har tyvärr inga inlägg ännu`
      postContainer.appendChild(apologyMessage)
      return 
    }else{
      filteredPosts.sort()
      filteredPosts.reverse()
      const imgChoice = await addImgToPosts(username)
      
      filteredPosts.forEach(posts => {
        
        const postTextDiv= document.createElement('div')
        const post = document.createElement('div')
        const postHeader = document.createElement('div')
        const date = document.createElement('p')
        const author = document.createElement('h2')
        const message = document.createElement('p')
        const imgContainer = document.createElement('div')
        const img: any= document.createElement('img')
        const titel = document.createElement('h1')
        post.classList.add('post')
        postHeader.classList.add('postHeader')
        postTextDiv.appendChild(postHeader)
        date.innerText = `${posts.date}`
        author.innerText = `${posts.username}`
        postContainer?.appendChild(post)
        titel.innerText = `${posts.title}`
        
        imgContainer?.appendChild(img)
        post.appendChild(imgContainer)
        img.src = imgChoice
        message.innerText = `${posts.message}`
        message.classList.add('message')
        postTextDiv.appendChild(message)
        postTextDiv.classList.add('postTextDiv')
        post.appendChild(postTextDiv)
        img.classList.add('profileImgPost')
        postHeader.appendChild(author)
        postHeader.appendChild(titel)
        postTextDiv.appendChild(date)
      })
    }
    
  })
  .catch((error) => {
    console.error(error);
  });
}
getPost(currentFeed)
const checkUsernameExists = async (username:string, inputValue: number): Promise<void> => {
  try {
    let config = {
      headers:{
        'crossorigin': 'true',
        'Access-Control-Allow-Origin':'true'
      }
    }
    const response = await axios.get(`https://socialmedia-49567-default-rtdb.europe-west1.firebasedatabase.app/users/${username}.json?`, config);
    const data = response.data;
    
    if(!data){
      checkInputCreate(usernameCreate?.value, emailCreate?.value, passwordCreate?.value, inputValue)
    }else{
      alert("username already taken")
    }
  } catch (error) {
    console.error(error);
  }
}

function getCookie():string {
  let name = "username=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(uvalue: string):void {
  const d = new Date();
  d.setTime(d.getTime() + (24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = "username=" + uvalue + ";" + expires + ";path=/; SameSite=none; Secure";
}
// document.cookie = "username=" + "shinsu" + ";" + "expires=Thu, 01 Jan 1970 00:00:00 UTC;"
function checkCurrentProfile(feed: string): void {
  profileh1.innerText= ""
  const cookie = getCookie()
  if(feed === cookie){
    profileh1.innerText = `Du kollar på din egna feed`
  }else{
    profileh1.innerText = `Du kollar på ${currentFeed}'s feed`
  }
}
function checkCookie(): void{
  let cookie = getCookie()
  if(cookie === ""){
    profileShow?.classList.add('inactive')
    contentHolder?.classList.add('inactive')
    createPostForm?.classList.add('inactive')
    loggedinAs?.classList.add('inactive')
    createNewPostBtn?.classList.add('inactive')
    logOutBtn?.classList.add('inactive')
  }else{
    profileShow?.classList.remove('inactive')
    contentHolder?.classList.remove('inactive')
    logInForm?.classList.add('inactive')
    createPostForm?.classList.add('inactive')
    loggedinAs?.classList.remove('inactive')
    createNewPostBtn?.classList.remove('inactive')
    welcomeText?.classList.add('inactive')
    logInBtn?.classList.add('inactive')
    createFormBtn?.classList.add('inactive')
    loggedinAs.innerText = `Inloggad som: ${cookie}`
    checkCurrentProfile(cookie)
  }
}
const addImgToPosts = async(username: string): Promise<string | undefined> =>{
  try{
    const response = await axios.get(`https://socialmedia-49567-default-rtdb.europe-west1.firebasedatabase.app/users/${username}.json`)
    const data = response.data
    switch (data.img) {
      case 1:
    
        return require("../images/garf1.jpg")
      case 2:
    
        return require("../images/garf2.jpg")
      case 3:
       
        return require("../images/garf3.jpg")
      case 4:
     
        return require("../images/garf4.jpg")
      default:
        console.log("Invalid option");

  }
}catch{
  console.log('faulty option')
}
}
const getUsers = async(username:string): Promise<void> => {
  axios.get(`https://socialmedia-49567-default-rtdb.europe-west1.firebasedatabase.app/users/.json`)
    .then(async(response) => {
      const data = await response.data
      const notMe = username
      const userDiv = document.createElement('div')
      const userHolder = document.getElementById('userHolder')
      userHolder?.appendChild(userDiv)
      const users = Object.keys(data)
      userDiv.classList.add('userDiv')
      users.forEach((u) =>{
        if(u != notMe){
          const user = document.createElement('h3')
          user.innerText = `${u}`
          userDiv?.appendChild(user)
          user.classList.add('userButton')
          user.addEventListener('click', () => {setNewCurrentUser(u)})
        }
      })
    })
}
function setNewCurrentUser(username: string): any{
  currentFeed = username
  checkCurrentProfile(currentFeed)
  getPost(currentFeed)
}
function clearPosts(): void{
  while(postContainer.firstChild){
    postContainer.removeChild(postContainer.firstChild);
  }
}
loggedinAs.addEventListener('click', () => {
  currentFeed = getCookie()
  checkCurrentProfile(currentFeed)
  getPost(currentFeed)}
)
  
getUsers(currentFeed)
checkCookie()

function loadComicImage() {
  const baseUrl = "https://www.arcamax.com/thefunnies/garfield";
  const xhr = new XMLHttpRequest();
 
  xhr.open("GET", baseUrl);
  xhr.send(null);
  xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
          const remotedoc: any = new DOMParser().parseFromString(xhr.responseText.replace(/<script(.|\s)*?\/script>/g, ''), 'text/html');
        
          let remoteUrl: any = remotedoc.getElementById("comic-zoom").getAttribute("data-zoom-image");

          let image = <HTMLImageElement> document.getElementById('comic');
          image.src = remoteUrl;
          const comicHolder = document.getElementById('comicHolder')
          comicHolder?.appendChild(image)
          
          
        }
      };
}
loadComicImage()
// #region nospaceallowed
const formTextFields = document.getElementsByClassName('noSpaces');
for(let i = 0; i < 5; i++){
  formTextFields[i].addEventListener('keypress', function(e){
    let keyboardEvent = <KeyboardEvent> e
        if (keyboardEvent.code === 'Space') {
          e.preventDefault();
        }
      })
}

// #endregion