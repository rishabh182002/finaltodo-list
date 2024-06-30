import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
 
const db=new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permlist",
  password: "Maniray@123",
  port: 5432,

});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [{ id: 1, work: "Buy milk" },
  { id: 2, work: "Finish homework" },
]; 
app.get("/", async(req, res) => {
  try{
    const result=await db.query("SELECT * FROM todo ORDER BY id ASC ");
     items=result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
}
  catch(err)
  {
    console.log(err);

  }
});

app.post("/add",async (req, res) => {
  const item = req.body.newItem;
  //items.push({ work: item });
  try{
  await db.query("INSERT INTO todo(work) VALUES($1)",[item]);
  res.redirect("/");
  }
  catch(err)
  {
    console.log(err);
  }
});

app.post("/edit", async(req, res) => {
  const text=req.body.updatedItemTitle;
  const id=req.body.updatedItemId;
  try{
    await db.query("UPDATE todo SET work=($1) WHERE id=$2",[text,id]);
    res.redirect("/");
  }
  catch (err) {
    console.log(err);
  }
});

app.post("/delete",async (req, res) => {
  const result=req.body.deleteItemId;
  try{
  await db.query("DELETE FROM todo WHERE id=$1;",[result]);
  res.redirect("/");
  }catch(err)
  {
    console.log(err);
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
