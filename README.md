**FreeCodeCamp**- Information Security and Quality Assurance
------

Project Personal Library

https://www.freecodecamp.org/learn/information-security-and-quality-assurance/information-security-and-quality-assurance-projects/personal-library


1) ADD YOUR MongoDB connection string to .env without quotes as db
    `example: DB=mongodb://admin:pass@1234.mlab.com:1234/fccpersonallib`
2) SET NODE_ENV to `test` without quotes
3) You need to create all routes within `routes/api.js`
4) You will add any security features to `server.js`
5) You will create all of the functional tests in `tests/2_functional-tests.js`


Nothing from my website will be cached in my client. > done > tested
The headers will say that the site is powered by 'PHP 4.2.0' even though it isn't (as a security measure). > done > tested
I can post a title to /api/books to add a book and returned will be the object with the title and a unique _id. > done > tested
I can get /api/books to retrieve an array of all books containing title, _id, and commentcount. > done >tested
I can get /api/books/{id} to retrieve a single object of a book containing _title, _id, & an array of comments (empty array if no comments present). > done >tested
I can post a comment to /api/books/{id} to add a comment to a book and returned will be the books object similar to get /api/books/{id} including the new comment. > done >tested
I can delete /api/books/{_id} to delete a book from the collection. Returned will be 'delete successful' if successful. > done >tested
If I try to request a book that doesn't exist I will be returned 'no book exists'. >done >tested
I can send a delete request to /api/books to delete all books in the database. Returned will be 'complete delete successful' if successful. > done >tested
All 6 functional tests required are complete and passing. > done
