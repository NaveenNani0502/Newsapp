const API_KEY="b0cac031428b463b87fecbf8a232524f";
const url="https://newsapi.org/v2/everything?q=";

window.addEventListener('load',()=> fetchNews("India")); // fetch news on page load 

function reload(){
    window.location.reload();//reload the page when user clicks on 'Reload'
}

async function fetchNews(query){ // fetching news from NewsAPI based on query (country, category etc.)
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`); //  sending a GET request to the NewsAPI server with the specified query and api key
    const data =await res.json(); //  convert response to json format
    console.log(data);
    bindData(data.articles); // bind the received data to HTML elements
}

//  binding the articles data with the respective html elements
function bindData(articles){ 
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    cardsContainer.innerHTML=""; //  clear old data before appending new one

    articles.forEach((article) => { //  loop through each article in array of articles
        if(!article.urlToImage)return;
        const cardClone = newsCardTemplate.content.cloneNode(true); //  clone template element and get its content, skip this iteration if there is no image for that particular article
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);//  append cloned card to container
    });
}

function fillDataInCard(cardClone, article){ //  filling up the content inside the clone
    const newsImg = cardClone.querySelector('#news-img'); //   getting the image element from the clone
    const newsTitle = cardClone.querySelector('#news-title');  //  getting title element from the clone
    const newsSource = cardClone.querySelector('#news-source');  //  source of the news
    const newsDesc = cardClone.querySelector('#news-desc');      // description of the news

    newsImg.src = article.urlToImage;                           // set img src attribute
    newsTitle.innerHTML= article.title;                          // set text content of title
    newsDesc.innerHTML= article.description;                      // set text content of desc
    
    const date = new Date(article.publishedAt).toLocaleString("en-US",{  
        timeZone:"Asia/Jakarta",                  //  timezone for Indonesian Standard Time
    });
    newsSource.innerHTML= `${article.source.name} ·${date}`;    // setting source and date

    cardClone.firstElementChild.addEventListener('click',()=>{        // adding click event listener to open full news in a new tab
        window.open(article.url,"_blank");           // open link in a new tab
    });
}

// This function is used for nav items (e.g IPL, Finance, Politics) if u select any one navitem it will show  the related category of news using fetchNews().

let curSelectedNav = null;
function onNavItemClick(id){
    fetchNews(id);
    const navItem= document.getElementById(id);
    curSelectedNav?.classList.remove("active"); //  remove active class from the previous selected item
    curSelectedNav=navItem; 
    curSelectedNav.classList.add("active"); //  add active class to the current clicked item
}

const searchButton= document.getElementById('search-button');  //  get button element
const inputSearch= document.getElementById('input-search'); 

searchButton.addEventListener('click', () => { //  when click on the button
    const query= inputSearch.value;        // get value from the input field
    if(!query) return;                        // if there is no value in the input field then do nothing
    fetchNews(query);                        // call the function with the given parameter (query)
    curSelectedNav?.classList.remove('active'); // remove active class from the navigation bar items
    curSelectedNav=null;                        // reset the variable
});