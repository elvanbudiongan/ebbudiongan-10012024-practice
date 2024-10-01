//fetch function for articles/stories
// async function  response(page){
//   const url = `https://node-hnapi.herokuapp.com/news?page=${page}`;
//   const response = await fetch(url);
//   const articles = await response.json();
//   return articles;
// }     // ------ aborted function, different URL cant be reuse for latest news.


// response(1).then(console.log)

//fetch HN news
async function fetchNews(page = 1){
  const url = `https://node-hnapi.herokuapp.com/news?page=${page}`;
  const response = await fetch(url);
  const articles = await response.json();
  displayArticles(articles, 'news-list', 'HN News');
  displayPagination(page, fetchNews)
}

//fetch LatestNews
async function fetchLatestNews(page = 1){
  const url = `https://node-hnapi.herokuapp.com/newest?page=${page}`;
  const response = await fetch(url);
  const articles = await response.json();
  //console.log(articles)
  displayArticles(articles, 'latest-news-list', 'Latest News');
  displayPagination(page, fetchLatestNews)
}

//fetchNews(1).then(console.log)

//displaying Articles
function displayArticles( article, listId, type){
  const newsList = document.getElementById(listId);
  newsList.innerHTML = '';
  article.forEach( story => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <a href="${story.url}">${story.title}</a>
      <p> By ${story.user}, <a href="./comments.html?id=${story.id}">${story.comments_count} comments </a></p>
    `
    newsList.appendChild(listItem);
  });
}

//for pagination
function displayPagination(currentPage, pageCtrl){
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.innerText = 'Previous';
  prevBtn.className = 'pagination-btn';
  prevBtn.disable = currentPage === 1;
  prevBtn.onclick = () => pageCtrl(currentPage - 1);

  const nextBtn = document.createElement('button');
  nextBtn.innerText = 'Next';
  nextBtn.className = 'pagination-btn';
  nextBtn.onclick = () => pageCtrl(currentPage + 1);

  pagination.appendChild(prevBtn);
  pagination.appendChild(nextBtn);
}

//fetch comments
async function fetchComment(){
  const comValue = new URLSearchParams(window.location.search);
  const storyId = comValue.get('id')
  const response = await fetch(`https://node-hnapi.herokuapp.com/item/${storyId}`)
  const article = await response.json();
  displayComments(article.comments, 'comment-container');
}

//display Comment
function displayComments(comments, containerId){
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  comments.forEach( comment => {
    const commentItem = document.createElement('div');
    commentItem.innerHTML = `
      <p><strong>${comment.user}</strong></p>
      <p>${comment.content}</p>
      <div class="nested-comments">
        ${comment.comments.length ? displayComments(comment.comments, containerId) : ''}
      </div>
    `   ;

     container.appendChild(commentItem);
  });
}


//event listener

if(window.location.pathname.endsWith('hackerNews.html')){
  fetchNews();
} else if(window.location.pathname.endsWith('latestNews.html')){
  fetchLatestNews();
}else if(window.location.pathname.endsWith('comments.html')) {
    fetchComment();
}
