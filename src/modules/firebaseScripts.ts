import axios from "../../node_modules/axios/lib/axios"
import { setNewCurrentUser } from "./script";
const postContainer = <HTMLDivElement>document.getElementById('postContainer')
function clearPosts(): void{
  while(postContainer.firstChild){
    postContainer.removeChild(postContainer.firstChild);
  }
}
const deleteUser = async(username:string): Promise<void> =>{
  interface Post {
    date: string;
    message: string;
    time: number;
    title: string;
    username: string;
  }
  try{
    let config = {
      headers:{
        'crossorigin': 'true',
        'Access-Control-Allow-Origin':'true'
      }
    }

    await axios.delete(`https://socialmedia-49567-default-rtdb.europe-west1.firebasedatabase.app/users/${username}.json`, config)
    const response = await axios.get("https://socialmedia-49567-default-rtdb.europe-west1.firebasedatabase.app/posts/.json")
    const posts: { [key: string]: Post } = response.data;

    const filteredPosts = Object.keys(posts)
    .map((key) => ({ id: key, ...posts[key] }))
    .filter((post) => post.username === username);
    for(let i = 0; i < filteredPosts.length; i++){
      await axios.delete(`https://socialmedia-49567-default-rtdb.europe-west1.firebasedatabase.app/posts/${filteredPosts[i].id}.json`)
    }
    document.cookie = "username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure" 
    location.reload()
  }catch{
    console.log("couldnt remove content")
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
        apologyMessage.innerText = `${username} har tyvärr inga inlägg ännu`
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
  const checkUsernameExists = async (username:string, inputValue: number): Promise<boolean|undefined> => {
    try {
      let config = {
        headers:{
          'crossorigin': 'true',
          'Access-Control-Allow-Origin':'true'
        }
      }
      const response = await axios.get(`https://socialmedia-49567-default-rtdb.europe-west1.firebasedatabase.app/users/${username}.json?`, config);
      const data = await response.data;
      
      if(!data){
        return true
      }else{
        alert("username already taken")
        return false
      }
    } catch (error) {
      console.error(error);
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

export {getPost, checkLogin, checkUsernameExists, getUsers, deleteUser}