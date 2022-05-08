const express = require("express");
const router = express.Router();
const booksData = require("../data/books");
const reviewData = require("../data/reviews");

router.get("/:id", async (req, res) => {
  try {
    const reviewBook = await booksData.getById(req.params.id);
    res.json(reviewBook);
  } catch (e) {
    res.status(404).json({ error: "Book not found" });
    return;
  }
});

router.get("/userreviews/:id", async (req, res) => {
  try {
    const reviewsOfUser = await reviewData.getAllReviewsOfUser(req.params.id);
    res.json(reviewsOfUser);
  } catch (e) {
    res.status(404).json({ error: "Reviews of user not found" });
    return;
  }
});

router.get("/bookreviews/:id", async (req, res) => {
  try {
    const reviewsOfBook = await reviewData.getAllReviewsOfBook(req.params.id);
    res.json(reviewsOfBook);
  } catch (e) {
    res.status(404).json({ error: "Reviews of book not found" });
    return;
  }
});

router.post("/:id", async (req, res) => {
  let reviewInfo = req.body;

  const currentDate = new Date();
  const dateOfReview =
    currentDate.getMonth() +
    1 +
    "/" +
    currentDate.getDate() +
    "/" +
    currentDate.getFullYear();

  console.log(dateOfReview);
  reviewInfo.rating = parseInt(reviewInfo.rating);

  try {
    await booksData.getById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Book not found" });
    return;
  }

  try {
    const newReview = await reviewData.createReview(
      req.params.id,
      req.session.user.userId.trim(),
      reviewInfo.rating,
      dateOfReview.trim(),
      reviewInfo.comment.trim(),
      req.session.user.username.trim()
    );
    const redirectUrl = "/books/" + req.params.id;
    res.redirect(redirectUrl);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/editReview/:id", async (req, res) => {
  try {
    const reviewDetails = await reviewData.getReview(req.params.id);
    res.status(200).json(reviewDetails);
  } catch (e) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
});

router.put("/updateReview/", async (req, res) => {
  let updateReviewInfo = req.body;
  updateReviewInfo.rating = parseInt(updateReviewInfo.rating);

  try {
    await reviewData.getReview(updateReviewInfo.reviewId);
  } catch (e) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  try {
    const updatedReview = await reviewData.updateReview(
      updateReviewInfo.reviewId,
      updateReviewInfo.rating,
      updateReviewInfo.comment
    );
    res.redirect("/books/" + updatedReview.bookId);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.delete("/deleteReview/:id", async (req, res) => {
  deleteReviewInfo = req.body;

  try {
    await reviewData.getReview(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  try {
    const deletedReview = await reviewData.removeReview(req.params.id);
    res.redirect("/books/" + deletedReview.bookId);
  } catch (e) {
    res
      .status(404)
      .json({ error: "Review cannot be deleted due to some error" });
  }
});

module.exports = router;
