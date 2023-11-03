import express from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  // req.session.passport.errors[0]
  res.render("login",{error:""});
})


router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // console.log(req.body.email)
      return res.render("login", { error: err.message}); 
    }

    if (!user) {
        return res.render("login", { error: "Password is Incorrect" });
      }
    
    // if(user){
    //   console.log("here----------------")
     
    //   return res.redirect("/dashboard");
    // }
    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.redirect("/dashboard")
      // return res.send({ success : true, message : 'authentication succeeded' });
    });  
    
  })(req, res, next);
});

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/auth/login",
//     /* FIX ME: 😭 failureMsg needed when login fails */
//   },
//   // (err, res, req)=>{
   
//   //   if(err.message.startsWith("Couldn't find user with email")){
//   //     res.render("login",{error:err})
//   //   }
//   //   }
  
//   )
// );

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});



router.get('/github',
  passport.authenticate('github',{ scope: [ 'user:email' ] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });




export default router;
