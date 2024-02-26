//le répertoire routes sera utilisé pour stocker les routes de notre application Express.
// Nous allons créer un fichier routes.js dans ce répertoire et y ajouter les routes de notre application.
const express = require('express');
const router = express.Router();
const User=require('../models/users') 
const multer=require("multer")
const fs=require("fs");

// pour le telechargement des fichiers son role est de stocker 
// les fichiers dans le dossier uploads qui est dans le dossier public

/*
Multer est un middleware pour Express.js qui simplifie la gestion des téléchargements de
 fichiers dans les applications web Node.js. Il facilite le traitement des fichiers envoyés 
 par les utilisateurs via des formulaires, par exemple.
  */

const storage = multer.diskStorage({ // pour le telechargement des fichiers son role est de stocker
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + file.originalname);
    }
});

const upload = multer({
     storage: storage 
    }).single('image');


/*
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        // Générer un nom de fichier unique pour les images et les PDF
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    }
});

// Configure Multer pour accepter à la fois les images et les fichiers PDF
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Format de fichier non pris en charge'), false);
        }
    }
}).single('file');  // Le champ 'file' est utilisé pour l'envoi du fichier dans le formulaire

*/


router.get('/', (req, res) => {
    User.find() 
      .then(users => res.status(200).render('index',{title:"Home",users:users}))
      .catch(error => res.status(400).json({message: error.message})) 
});

router.get('/add', (req, res) => {
    res.render('add_users',{title:"Add users"});
});

router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id)
        .then(user => {
            res.render('edit_users',{title:"Edit users",user:user});
        })
        .catch(error => {
            res.json({ message: error.message, type: "danger" });
          //  res.redirect('/');
        });
});


//modification d'un utilisateur dans la base de données

router.post("/update/:id", upload, (req, res) => {
    let id = req.params.id;
    let newImage = ""
    if (req.file) {
        newImage = req.file.filename;
        try {
            fs.unlinkSync("./uploads/" + req.body.oldImage);
        } catch (error) {
            console.log(error);
     }
    }
    else {
        newImage = req.body.oldImage;
    }

    let user = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: newImage,
    };

    User.findByIdAndUpdate(id, user, { new: true })
      .then(() => {
            req.session.message = {
                type: "success",
                message: "User updated successfully"
            };
            res.redirect('/');
        })
      .catch((error) => {
            res.json({ message: error.message, type: "danger" });
        });
});



//insertion d'un utilisateur dans la base de données

router.post("/add", upload, (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });

    user.save()
        .then(() => {
            req.session.message = {
                type: "success",
                message: "User added successfully"
            };
            res.redirect('/');
        })
        .catch((error) => {
            res.json({ message: error.message, type: "danger" });
        });
});

//suppression d'un utilisateur dans la base de données

//j'utilise la méthode get car j'ai aucun formulaire pour la suppression
router.get("/delete/:id", (req, res) => {
    let id = req.params.id;
    User.findByIdAndDelete(id)
      .then(() => {
            req.session.message = {
                type: "success",
                message: "User deleted successfully"
            };
            res.redirect('/');
        })
      .catch((error) => {
            res.json({ message: error.message, type: "danger" });
        });
});

module.exports = router;
