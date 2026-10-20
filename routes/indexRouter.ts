import {Router} from "express";
import { title } from "node:process";
const router=Router();
const messages:{
    id:number;
    text:string;
    user:string;
    added:Date;

}[]=[
     {
        id:1,
    text: "Hi there!",
    user: "Amando",
    added: new Date(),
  },
  {
    id:2,
    text: "Hello World!",
    user: "Charles",
    added: new Date(),
  },
];

router.get("/",(req,res)=>{
    res.render("index",{
        title:"Mini Message Board",
        messages:messages,
    });

});
router.get("/new", (req, res) => {
  res.render("form", {
    title: "New Message",
  });
});
router.post("/new", (req, res) => {
  const { messageUser, messageText } = req.body;

  messages.push({
    id: messages.length + 1,
    text: messageText,
    user: messageUser,
    added: new Date(),
  });

  res.redirect("/");
});
router.get("/message/:id", (req, res) => {
  const id = Number(req.params.id);
  const message = messages.find((message) => message.id === id);

  if (!message) {
    res.status(404).send("Message not found");
    return;
  }

  res.render("message", {
    title: "Message Details",
    message: message,
  });
});

export default router;