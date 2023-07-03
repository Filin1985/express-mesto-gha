const router = require("express").Router();
const {
  getCards,
  deleteCard,
  createNewCard,
  addLikeToCard,
  deleteLikeFromCard,
} = require("../controllers/cards");

router.get("/", getCards);
router.post("/", createNewCard);
router.delete("/:cardId", deleteCard);
router.put("/:cardId/likes", addLikeToCard);
router.delete("/:cardId/likes", deleteLikeFromCard);

module.exports = router;
