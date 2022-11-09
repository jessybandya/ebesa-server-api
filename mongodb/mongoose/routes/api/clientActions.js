//CRUD operations for users
const router = require("express").Router();
const db = require("../../connector");
ProductModel = require("../../models/product.js");
CartModel = require("../../models/cart.js");
BrandModel = require("../../models/brand.js");
UserModel = require("../../models/user.js");
ArticleModel = require("../../models/article.js");
const jwt = require("jsonwebtoken");

//Importing dependendlcies
const passport = require("passport");
const localStrategy = require("passport-local");
const flash = require("connect-flash");

require("dotenv").config({
  path: require("find-config")(".env"),
});
const auth = passport.authenticate("jwt", {
  session: false,
});

//Middleware
router.use(flash());

//A user can:
//Create an account
router.post("/signup", function (req, res, next) {
  passport.authenticate(
    "local-signup",
    { session: false },
    async function (err, user, info) {
      try {
        await UserModel.findOneAndUpdate(
          { email: req.body.email },
          { firstName: req.body.firstName, lastName: req.body.lastName },
          { new: true }
        );

        await req.login(user, { session: false }, (err) => {
          if (err) {
            return next(err);
          }

          const payload = {
            id: user._id,
            email: user.email,
          };
          const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET);
          console.log("JWT signed.");
          res.status(200).json({
            success: true,
            token: `Bearer ${token}`,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            },
          });
        });
      } catch (err) {
        console.log("Passport Signup err: " + err);
        res.send("Sign up error: " + err);
        return next(err);
      }
    }
  )(req, res, next);
});

//Sign in
router.post("/signin", function (req, res, next) {
  passport.authenticate("local-login", function (err, user, info) {
    try {
      if (!user) {
        console.log("The user dne.");
      }

      req.login(
        user,
        {
          session: false,
        },
        (err) => {
          if (err) {
            return next(err);
          }

          const payload = {
            id: user._id,
            email: user.email,
          };
          const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET);
          console.log("JWT signed.");
          res.status(200).json({
            success: true,
            token: `Bearer ${token}`,
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
            },
          });
        }
      );
    } catch (err) {
      console.log("Passport err: " + err);
      res.send("Sign in error: " + err);
      return next(err);
    }
  })(req, res, next);
});

//Create a new post
router.post("/articles/new", (req, res) => {
  try {
    ArticleModel.create({
      title: req.body.title,
      body: req.body.body,
      author: req.body.author,
    });
  } catch (err) {
    res.send("An error occurred: " + err);
  }
});

//Surf through all the articles
router.get("/articles", async (req, res) => {
  const articles = await ArticleModel.find({});
  res.send(articles);
});

//Surf through all the users
router.get("/members", async (req, res) => {
  const members = await UserModel.find({});
  
  res.send(members);
});

//View a specific article
router.get("/articles/:id", async (req, res) => {
  const article = await ArticleModel.findById(req.params.id);
  
  res.send(article);
});

//Comment on a specific article
router.post("/articles/:id/comment", async (req, res) => {
  const article = await ArticleModel.findById(req.params.id);
  const addComment = await article.comments.push(req.body);
  console.log("Comment added.");
});

//Like a specific article
router.get("/articles/:id/like", async (req, res) => {
  console.log("Liking article...");
  const article = await ArticleModel.findById(req.params.id);
  const liking = await article.numLikes++;
  const updated = await article.save();
  const newNumber = await article.numLikes;
  res.send("New num of likes=/" + newNumber);
  console.log(`User Liked ${article.title}.`);
});

//Unlike a specific article
router.get("/articles/:id/unlike", async (req, res) => {
  console.log("UnLiking article...");
  const article = await ArticleModel.findById(req.params.id);
  const unLiking = await article.numLikes--;
  const updated = await article.save();
  const newNumber = await article.numLikes;
  res.send("New num of likes=/" + newNumber);
  console.log(`User Unliked ${article.title}.`);
});

//Search the database for a specific article
router.post("/articles/search", (req, res) => {
  try {
    /*const results = ArticleModel.find({
    title: req.body,
  });*/
    console.log(req.body);
    res.send(results);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
/*Search the database for users
router.get("/articles/search", (req, res) => {
  const results = ArticleModel.find({
    title: req.body.query,
  });
});*/

//Search the database for brands
router.get("/search/brands", (req, res) => {
  res.send(
    BrandModel.find({
      name: req.body.name,
    })
  );
});

//See product information
router.get("/card", (req, res) => {
  res.send(
    ProductModel.find({
      id: req.body.id,
    })
  );
});

//View and add products to the shopping cart
router.put("/cart", auth, (req, res) => {
  CartModel.findOneAndUpdate(
    {
      id: req.body.id,
    },
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      purchasePrice: {
        type: Number,
        default: 0,
      },
      totalPrice: {
        type: Number,
        default: 0,
      },
      priceWithTax: {
        type: Number,
        default: 0,
      },
      totalTax: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
        default: "Not processed",
        enum: [
          "Not processed",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ],
      },
    }
  );
});

//Delete products from the cart
router.delete("/cart", auth, (req, res) => {
  CartModel.deleteOne({
    id: req.body.id,
  });
});

//Modify the quantity of products in the cart
router.put("/cart", auth, (req, res) => {
  CartModel.findOneAndUpdate(
    {
      id: req.body.id,
    },
    {
      quantity: req.body.quantity,
    }
  );
});

//Pay for the products in the cart
router.get("/checkout", auth, (req, res) => {
  //Call StripeJS
});

//Sign out
router.get("/signout", auth, (req, res) => {
  req.logout();
  res.redirect("api/client/signin");
});

module.exports = router;
