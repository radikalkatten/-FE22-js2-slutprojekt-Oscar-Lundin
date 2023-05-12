import * as UserCreator from "./UserCreator"
import * as postCreator from "./postCreator"
import { getPost, checkLogin, checkUsernameExists, getUsers, deleteUser} from "./firebaseScripts"
import { getCookie, setCookie } from "./cookies"
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
const welcomeText = document.getElementById('welcomeText')
const profileShow = document.getElementById('profileShow')
const profileh1 = <HTMLTextAreaElement> document.getElementById('profileh1')
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
    showFeedLoggedIn()
    currentFeed = getCookie()
    checkCurrentProfile(currentFeed)
    getPost(currentFeed)
    loggedinAs.innerText = `Inloggad som: ${currentFeed}`
  }else{
    return
  }
})
createSubmit?.addEventListener('click', async ()=>{
  const input = <HTMLInputElement>document.querySelector('input[name="profilePic"]:checked')
  let checkuser = await checkUsernameExists(usernameCreate?.value, Number(input.value))
  const inputvalue = parseInt(input.value)
  if(checkuser == true){
    checkInputCreate(usernameCreate?.value, emailCreate?.value, passwordCreate?.value, inputvalue)
  }
})
const deleteButton = document.getElementById('deleteButton')
deleteButton?.addEventListener('click', () =>{deleteUser(getCookie())})

function checkInputCreate(username:string, email:string, password:string, profile:number): void {
  if(username == "" || email == "" || password == ""){
    alert("please fill out all fields")
  }else{
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

getPost(currentFeed)


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

function showFeedLoggedIn(){
  profileShow?.classList.remove('inactive')
  contentHolder?.classList.remove('inactive')
  logInForm?.classList.add('inactive')
  deleteButton?.classList.remove('inactive')
  createPostForm?.classList.add('inactive')
  loggedinAs?.classList.remove('inactive')
  createNewPostBtn?.classList.remove('inactive')
  welcomeText?.classList.add('inactive')
  logInBtn?.classList.add('inactive')
  createFormBtn?.classList.add('inactive')
  contentHolder?.classList.remove('inactive')
  logOutBtn?.classList.remove('inactive')
}

function hideFeed(){
  profileShow?.classList.add('inactive')
  contentHolder?.classList.add('inactive')
  createPostForm?.classList.add('inactive')
  loggedinAs?.classList.add('inactive')
  createNewPostBtn?.classList.add('inactive')
  logOutBtn?.classList.add('inactive')
  deleteButton?.classList.add('inactive')
}

function checkCookie(): void{
  let cookie = getCookie()
  if(cookie === ""){
    hideFeed()
    
  }else{
    showFeedLoggedIn()
    checkCurrentProfile(cookie)
  }
}

export function setNewCurrentUser(username: string): any{
  currentFeed = username
  checkCurrentProfile(currentFeed)
  getPost(currentFeed)
}

loggedinAs.addEventListener('click', () => {
  currentFeed = getCookie()
  checkCurrentProfile(currentFeed)
  getPost(currentFeed)}
)
  
getUsers(currentFeed)
checkCookie()

// get garfield strip 
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