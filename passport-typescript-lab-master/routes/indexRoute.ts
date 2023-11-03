import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { Store } from "express-session";

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", (req, res) => {

  



  if (req.user && req.user.role === "admin") {
    if (req.sessionStore.all) {
      let a: {}[] = [];
      req.sessionStore.all((err, sessions) => {
        if (sessions) {
          // console.log(sessions)

          let sessionids = Object.keys(sessions);

          for (const id of sessionids) {
            //@ts-ignore
            const session = sessions[id];
            // console.log(id)
            const passportValue = session.passport.user;
            a.push({ sessionID: id, userid: passportValue });

            // console.log(`User ID for session ${sessionId}: ${passportValue}`);
          }


          function destroySession(id:string){
            // console.log("id")
            req.sessionStore.destroy(id)
          }

          res.render("admin", {
            user: req.user,
            data: a,
            destroy:(destroySession)
          });

          // console.log(a);
        }
      });
    }
  } else {
    res.redirect("/auth/login");
  }



});


export default router;
