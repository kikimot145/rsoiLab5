class API {

    constructor() {
        this.host = "http://127.0.0.1:3000";
    }

    requestData(method, httpMethod, params) {
        const url = this.host + '/' + method;
        const httpRequest = {
            method: httpMethod,
			headers: {
				'Content-type': 'application/json',
				'Access-Control-Request-Method': httpMethod
			},
			mode: 'cors',
			body: null
        };
        if(httpMethod === 'POST' && typeof params !== 'undefined') {
			httpRequest.body = JSON.stringify(params);
        }

        return fetch(url, httpRequest).then(
			function(response) {
				console.log(response);
				return response.json();
			},
			function(response) {
				document.getElementsByClassName("error")[0].innerHTML = 'Connection issues: ' + response;
				console.log('Connection issues: ', response);
				return response;
			}
		);
    }

}

const rederFio = document.getElementById('login_block');

const pageTitle = document.getElementById('pageTitle');
const baList = document.getElementById('baList');
const bookInfo = document.getElementById('bookInfo');
const btnTake = document.getElementById('btnTake');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const msgText = document.getElementById('msgText');

const api = new API();

var readerId = 1;
var readerName = null;

function rerender(pageRenderFunc, arg) {
	if (!readerName) {
		api.requestData('readers/'+readerId, 'GET').then(function (readerInfo) {
			
				if (readerInfo && typeof(readerInfo.fio) != 'undefined') {
					readerName = readerInfo.fio;
				}
			
			rederFio.innerText = readerName;
			console.log(readerInfo);
		});
	}
	
	baList.style.display = "none";
	bookInfo.style.display = "none";
	btnTake.style.display = "none";
	btnPrev.style.display = "none";
	btnNext.style.display = "none";
	
	book_to_return.style.border = "0px solid";
	
	while (baList.lastChild) {
		baList.removeChild(baList.lastChild);
	}
	
	msgText.innerText = '';
	
	pageRenderFunc(arg);
}

function renderBooks(page) {
	baList.style.display = "block";
	btnPrev.style.display = "block";
	btnNext.style.display = "block";
	
	pageTitle.innerText = "Список книг";
	
	let size = 2;
	
	if (page == 0) btnPrev.style.visibility = "hidden";
	else  btnPrev.style.visibility = "visible";
	
	btnPrev.getElementsByTagName('a')[0].href = 'javascript:rerender(renderBooks,'+(page-1)+');';
	btnNext.getElementsByTagName('a')[0].href = 'javascript:rerender(renderBooks,'+(page+1)+');';
	
	api.requestData('books?page='+page+'&size='+size, 'GET').then(function (books) {
		if ((page+1)*size >= books.count) btnNext.style.visibility = "hidden";
		else btnNext.style.visibility = "visible";
		
		books.rows.forEach(function (book) {
			let listEntry = document.createElement('div');
			listEntry.className = 'listEntry';
			
			baList.appendChild(listEntry);
			
			let aTag = document.createElement('a');
			aTag.href = 'javascript:rerender(renderBook,'+book.id+');';
			aTag.innerText = '"'+book.title+'" ('+book.year+' г.)';
			if (typeof (book.author) != 'undefined') aTag.innerText = aTag.innerText + ' - '+book.author.fio;
			
			listEntry.appendChild(aTag);
		});
	});
}

function renderAuthors(page) {
	baList.style.display = "block";
	btnPrev.style.display = "block";
	btnNext.style.display = "block";
	
	pageTitle.innerText = "Список авторов";
	
	let size = 2;
	
	if (page == 0) btnPrev.style.visibility = "hidden";
	else  btnPrev.style.visibility = "visible";
	
	btnPrev.getElementsByTagName('a')[0].href = 'javascript:rerender(renderAuthors,'+(page-1)+');';
	btnNext.getElementsByTagName('a')[0].href = 'javascript:rerender(renderAuthors,'+(page+1)+');';
	
	api.requestData('authors?page='+page+'&size='+size, 'GET').then(function (authors) {
		if ((page+1)*size >= authors.count) btnNext.style.visibility = "hidden";
		else btnNext.style.visibility = "visible";
		
		authors.rows.forEach(function (author) {
			let listEntry = document.createElement('div');
			listEntry.className = 'listEntry';
			
			baList.appendChild(listEntry);
			
			let aTag = document.createElement('a');
			aTag.href = 'javascript:rerender(renderAuthor,{author:'+author.id+',page:0});';
			aTag.innerText = author.fio;
			
			listEntry.appendChild(aTag);
		});
	});
}

function renderAuthor(info) {
	baList.style.display = "block";
	btnPrev.style.display = "block";
	btnNext.style.display = "block";
	
	
	let author = info.author;
	
	
	api.requestData('authors/'+author, 'GET').then(function (author) {
		pageTitle.innerText = author.fio;
	});
	
	let page = info.page;
	let size = 2;
	
	if (page == 0) btnPrev.style.visibility = "hidden";
	else  btnPrev.style.visibility = "visible";
	
	btnPrev.getElementsByTagName('a')[0].href = 'javascript:rerender(renderAuthor,{author:'+author.id+',page:'+(page-1)+'});';
	btnNext.getElementsByTagName('a')[0].href= 'javascript:rerender(renderAuthor,{author:'+author.id+',page:'+(page+1)+'});';
	
	api.requestData('books?author='+author+'&page='+page+'&size='+size, 'GET').then(function (books) {
		if ((page+1)*size >= books.count) btnNext.style.visibility = "hidden";
		else btnNext.style.visibility = "visible";
		
		
		books.rows.forEach(function (book) {
			let listEntry = document.createElement('div');
			listEntry.className = 'listEntry';
			
			baList.appendChild(listEntry);
			
			let aTag = document.createElement('a');
			aTag.href = 'javascript:rerender(renderBook,'+book.id+');';
			aTag.innerText = '"'+book.title+'" ('+book.year+' г.)';
			if (typeof (book.author) != 'undefined') aTag.innerText = aTag.innerText + ' - '+book.author.fio;
			
			listEntry.appendChild(aTag);
		});
	});
}

function renderBook(id) {
	bookInfo.style.display = "block";
	btnTake.style.display = "block";
	
	api.requestData('books/'+id, 'GET').then(function (book) {
		console.log(book);
		pageTitle.innerText = '"'+book.title+'" ('+book.year+' г.)';
		if (typeof (book.author) != 'undefined') pageTitle.innerText = book.author.fio + ' - ' + pageTitle.innerText;
		
		bookInfo.innerText = book.about;
		
		btnTake.getElementsByTagName('a')[0].href= 'javascript:rerender(getBook,'+book.id+');';
	});
}

function getBook(bookId) {
	api.requestData('readers/'+readerId+'/books?book='+bookId, 'PATCH').then(function (ans) {
		if (ans.result == 1) msgText.innerText = 'Книга успешно заказана';
		else msgText.innerText = 'Заказ книги не удался - скорее всего свободных экземпляров нет';
	});
	
	rerender(renderBook, bookId);
}

function returnBook() {
	let bookId = book_to_return.value;
	console.log(bookId);
	bookId = Number(parseInt(bookId));
	if ((isNaN(bookId) || bookId < 0)) {
		
		book_to_return.style.border = "4px solid red";
		return;
	}
		
	api.requestData('readers/'+readerId+'/books?book='+bookId, 'DELETE').then(function (ans) {
		if (ans.result == 1) msgText.innerText = 'Книга успешно возращена';
		else msgText.innerText = 'Возврат книги не удался - это точно ваша книга?';
	});
	
	rerender(renderBooks, 0);
}

rerender(renderBooks, 0);