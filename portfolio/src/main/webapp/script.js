// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


//              Constants              //
/** HTML class name for project images */
const CLASS_PROJECT_IMGS = 'project_imgs';
/** HTML class name for rock climning elements */
const CLASS_ROCK_CLIMBING = 'rock_climbing';
/** HTML element ID for google translate */
const ELEMENT_GOOGLE_TRANSLATE = 'google_translate_element';
/** HTML element ID for comment text area */
const ELEMENT_TEXTAREA_COMMENT = 'textarea-comment';
/** HTML element ID for user text area */
const ELEMENT_TEXTAREA_USER = 'textarea-user';
/** HTML element ID for comment container */
const ELEMENT_COMMENT_CONTAINER = 'comment-container';
const ELEMENT_COMMENTS = 'comments';
const ELEMENT_COMMENT_DIV = 'comment-div';
const ELEMENT_USER_TEXT = 'user-text';
const ELEMENT_TIME_TEXT = 'time-text';
const ELEMENT_COMMENT_TEXT = 'comment-text';
const ELEMENT_DELETE_BUTTON = 'delete-button';
const ELEMENT_INDIV_DELETE = 'indiv-delete-button';
/** Parameter id for user */
const PARAM_USER = 'user';
/** Parameter id for comment */
const PARAM_COMMENT = 'comment';
/** Parameter id for comment id */
const PARAM_ID = 'id';
/** Parameter id for Max Comment */
const PARAM_MAX_COMMENT = 'max-comments';
/** Parameter id for page number */
const PARAM_PAGE = 'page';
/** Fetch new comment servlet */
const FETCH_NEW_COMMENT = '/new-comment';
/** Fetch comment servlet */
const FETCH_COMMENT = '/comment';
/** Fetch delete comments servlet */
const FETCH_DELETE_COMMENTS = '/delete-comments';
/** Fetch delete comment servlet */
const FETCH_DELETE_COMMENT = '/delete-comment';
/** Servlet method type */
const SERVLET_METHOD_POST = 'POST';
/** Display style value of block*/
const STYLE_BLOCK = 'block';
/** Display style value of none */
const STYLE_NONE = 'none';
/** Language id for Albanian */
const LANGUAGE_ALBANIAN = 'sq';

/** HTML elements */
const HTML_ELEMENT_LI = 'li';
const HTML_ELEMENT_DIV = 'div';
const HTML_ELEMENT_P = 'p';
const HTML_ELEMENT_BUTTON = 'button';

/** Current Page Number */
let pageNum = 0;
let maxPages;

/**
 * Changes the image that is displaying corresponds to the id specified.
 * @param {string} id The id of the image to display.
 */
function displayImage(id) {
  var elements = document.getElementsByClassName(CLASS_PROJECT_IMGS);
  for (let element of elements) {
    if (element.id === id){
      element.style.display = STYLE_BLOCK;
    } else {
      element.style.display = STYLE_NONE;
    }
  }
}

/**
 * Displays the videos that are labled rock_climbing.
 */
function displayRockClimbingVideos() {
  var elements = document.getElementsByClassName(CLASS_ROCK_CLIMBING);
  for (let element of elements) {
    element.style.display = STYLE_BLOCK
  }
}

/**
 * Initialies a Google Translate element for translating albanian segment
 */
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: LANGUAGE_ALBANIAN, 
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE }, 
    ELEMENT_GOOGLE_TRANSLATE);
}

/** submits the user comment to servlet  */
function submitComment() {
  const commentElement = document.getElementById(ELEMENT_TEXTAREA_COMMENT);
  const usernameElement = document.getElementById(ELEMENT_TEXTAREA_USER);
  const params = new URLSearchParams();

  var username = usernameElement.innerText;
  if (username === ''){
    username = 'Anonymous';
  }
  params.append(PARAM_USER, username);
  params.append(PARAM_COMMENT, commentElement.innerText);

  usernameElement.innerText = '';
  commentElement.innerText = '';

  fetch(FETCH_NEW_COMMENT, {method: SERVLET_METHOD_POST, body: params})
    .then(removeCommentsFromDOM)
    .then(loadComments);

}

/** Sends new maximum number of comments to display */
function changeMaxComments(maxNum) {
  const params = new URLSearchParams();
  params.append(PARAM_MAX_COMMENT, maxNum);

  fetch(FETCH_COMMENT, {method: SERVLET_METHOD_POST, body: params})
    .then(removeCommentsFromDOM)
    .then(loadComments);
}

/** Fetches the comments from the servlet */
function loadComments() {
  fetch(FETCH_COMMENT).then(response => response.clone().json())
    .then(data => {
      addCommentsToDOM(data.comments);
      maxPages = data.maxPages;
    });
}

/** Sends the server a fetch to change the page of comments displayed */
function incrementPage(num) {
  pageNum += num;
  if (pageNum > maxPages) {
    pageNum = maxPages;
  } else if (pageNum < 0) {
    pageNum = 0;
  }

  const params = new URLSearchParams();
  params.append(PARAM_PAGE, pageNum);
  fetch(FETCH_COMMENT, { method: SERVLET_METHOD_POST, body: params})
    .then(removeCommentsFromDOM)
    .then(loadComments);
}

/** Adds comments with user name to DOM. */
function addCommentsToDOM(comments) {
    const commentListElement = document
      .getElementById(ELEMENT_COMMENT_CONTAINER);

    comments.forEach((comment) => {
      var time = new Date(comment.timestamp);
      commentListElement.appendChild(createCommentElementList(comment));
    });
}

/** Sends request to delete comments from database */
function deleteComments() {
  fetch(FETCH_DELETE_COMMENTS, {method: SERVLET_METHOD_POST})
    .then(removeCommentsFromDOM);
}

/** Deletes the elements from the DOM */
function removeCommentsFromDOM(){
  const commentListElement = document
    .getElementById(ELEMENT_COMMENT_CONTAINER);
  while (commentListElement.lastElementChild) {
    commentListElement.removeChild(commentListElement.lastElementChild);
  }
}

/** Deletes the specified comment */
function deleteComment(comment) {
  const params = new URLSearchParams();
  params.append(PARAM_ID, comment.id);
  fetch(FETCH_DELETE_COMMENT, {method: SERVLET_METHOD_POST, body: params});
}

/**
 * Creates an list element with prespecified text
 * @param {string} text Text to be put in the list element
 */
function createCommentElementList(comment) {
  const liElement = document.createElement(HTML_ELEMENT_LI);
  const innerDiv = document.createElement(HTML_ELEMENT_DIV);
  const userElement = document.createElement(HTML_ELEMENT_P);
  const timeElement = document.createElement(HTML_ELEMENT_P);
  const commentTextElement = document.createElement(HTML_ELEMENT_P);
  const deleteCommentButton = document.createElement(HTML_ELEMENT_BUTTON);

  liElement.classList.add(ELEMENT_COMMENTS);
  innerDiv.classList.add(ELEMENT_COMMENT_DIV);
  userElement.classList.add(ELEMENT_USER_TEXT);
  timeElement.classList.add(ELEMENT_TIME_TEXT);
  commentTextElement.classList.add(ELEMENT_COMMENT_TEXT);
  deleteCommentButton.classList.add(ELEMENT_DELETE_BUTTON);
  deleteCommentButton.id = ELEMENT_INDIV_DELETE;

  userElement.innerText = comment.user + ':';
  var timezone = new Date(comment.timestamp);
  timeElement.innerText = timezone.toLocaleString();
  commentTextElement.innerText = comment.comment;
  deleteCommentButton.innerText = 'x';
  deleteCommentButton.addEventListener('click', () => {
    deleteComment(comment);

    //Remove the element holding the comment
    liElement.remove();
  })

  innerDiv.appendChild(deleteCommentButton);
  innerDiv.appendChild(timeElement);
  innerDiv.appendChild(userElement);
  innerDiv.appendChild(commentTextElement);
  liElement.appendChild(innerDiv);
  return liElement;
}
