  //imports
  require("dotenv").config() //required to PORT

  const express=require("express")
  const session = require("express-session")
  const mongoose=require("mongoose")

  const app=express()
  const PORT=process.env.PORT || 4000

  // Connexion à la base de données MongoDB avec Mongoose
  mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Vérifier la connexion à la base de données
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
  db.once('open', () => {
    console.log('Connecté à la base de données MongoDB');
  });

  //middlewares
  app.use(express.static("uploads")) //pour pouvoir utiliser les fichiers statiques
  /*
  La ligne app.use(express.static("uploads")) est utilisée pour déclarer un répertoire comme 
  répertoire statique dans Express. Cela signifie que le contenu de ce répertoire (dans ce cas,
     le répertoire "uploads") sera rendu disponible de manière statique, ce qui permet aux utilisateurs 
     d'accéder à ces fichiers directement depuis le navigateur.

 */
  app.use(express.json()) //pour pouvoir lire le body des requêtes
  app.use(express.urlencoded({extended:false})) //pour pouvoir lire le body des requêtes
  app.use(session({   
      secret:process.env.SECRET,
      resave:false,
      saveUninitialized:true
  })) //pour pouvoir utiliser les sessions

  app.use((req,res,next)=>{
      res.locals.message=req.session.message 
      delete req.session.message
      next()
  }) //pour pouvoir utiliser les sessions

  app.set('view engine', 'ejs'); //pour pouvoir utiliser ejs

  // app.get("/",(req,res)=>{
  //     res.send("hello world")
  // })

  app.use(require("./routes/routes")) //pour pouvoir utiliser les routes

  app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`)
  })




/*dans models on met les fichiers js qui vont nous permettre de créer des modèles par exemple
  pour créer un utilisateur, un article, un commentaire, etc.*/
  // Path: routes/routes.js
  /*views on met les fichiers ejs dans le dossier views et on les appelle
   dans les routes avec res.render pour les afficher*/