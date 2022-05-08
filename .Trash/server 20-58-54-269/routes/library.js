const express = require("express");
const router = express.Router();
const booksData = require("../data/books");

function validateStringParams(param, paramName) {
    if (!param) {
        throw `Error: No ${paramName} passed to the function`;
    } else if (typeof param !== "string") {
        throw `Type Error: Argument ${param} passed is not a string ${paramName}`;
    } else if (param.length === 0) {
        throw `Error: No element present in string ${paramName}`;
    } else if (!param.trim()) {
        throw `Error: Empty spaces passed to string ${paramName}`;
    }
}
function validateBoolParams(param, paramName) {
    if (!param) {
        throw `Error: No ${paramName} passed to the function`;
    }
    if (typeof param != "boolean") {
        throw `Type Error: Argument ${param} passed is not a boolean ${paramName}`;
    }
}
function validateDate(dateParams) {
    const validDateFormat = /^\d{2}\-\d{2}\-\d{4}$/;
    if (!dateParams.match(validDateFormat)) {
        throw "date is not in valid format";
    }
}

function validateCreations(customerId, bookId, startDate, endDate, rentedFlag) {
    validateStringParams(customerId, "customerId");
    validateStringParams(bookId, "bookId");
    validateBoolParams(rentedFlag, "rentedFlag");
    validateStringParams(startDate, "startDate");
    validateStringParams(endDate, "endDate");
    validateDate(startDate);
    validateDate(endDate);
}

router.get("/", async (req, res) => {
    try {
        let books = await booksData.getBooksForRent();
        console.log(books);
        res.status(200).json(books);
        return books;
    } catch (e) {
        res.status(500).json({error: e});
        return e.message;
    }
});

router.post("/", async (req, res) => {
    let bookToBeRented = req.body.data;
    try {
        if (Object.keys(req.body.data).length === 0) {
            throw `No data provided for rented book`;
        }
        validateCreations(
            bookToBeRented.customerId,
            bookToBeRented.bookId,
            bookToBeRented.startDate,
            bookToBeRented.endDate,
            bookToBeRented.rentedFlag
        );
    } catch (e) {
        console.log(e);
        res.status(400).json({error: e});
        return;
    }
    try {
        console.log(req.body);
        let books = await booksData.addRentedBook(
            bookToBeRented.customerId,
            bookToBeRented.bookId,
            bookToBeRented.startDate,
            bookToBeRented.endDate,
            bookToBeRented.rentedFlag
        );
        console.log(books);
        res.status(200).json(books);
        return books;
    } catch (e) {
        console.log(e);
        res.status(500).json({error: "Book could not be rented"});
        return e.message;
    }
});

module.exports = router;
