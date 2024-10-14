import { Router } from "express";

import { Film, NewFilm } from "../types";


const router = Router();

const defaultFilms: Film[] = [
  {
    id: 1,
    title: "Shang-Chi and the Legend of the Ten Rings",
    director: "Destin Daniel Cretton",
    duration: 132,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/7/74/Shang-Chi_and_the_Legend_of_the_Ten_Rings_poster.jpeg",
    description:
      "Shang-Chi, the master of unarmed weaponry-based Kung Fu, is forced to confront his past after being drawn into the Ten Rings organization.",
    budget: 150,
  },
  {
    id: 2,
    title: "The Matrix",
    director: "Lana Wachowski, Lilly Wachowski",
    duration: 136,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg",
    description:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    budget: 63,
  },
  {
    id: 3,
    title: "Summer Wars",
    director: "Mamoru Hosoda",
    duration: 114,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/7/7d/Summer_Wars_poster.jpg",
    description:
      "A young math genius solves a complex equation and inadvertently puts a virtual world's artificial intelligence in a position to destroy Earth.",
    budget: 18.7,
  },
  {
    id: 4,
    title: "The Meyerowitz Stories",
    director: "Noah Baumbach",
    duration: 112,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/a/af/The_Meyerowitz_Stories.png",
    description:
      "An estranged family gathers together in New York City for an event celebrating the artistic work of their father.",
  },
  {
    id: 5,
    title: "her",
    director: "Spike Jonze",
    duration: 126,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/4/44/Her2013Poster.jpg",
    description:
      "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.",
    budget: 23,
  },
];


//Read all films, filtered by minimum-duration if the query param exists
router.get("/", (req, res) => {
  if (req.query["minimum-duration"]===undefined) {
    return res.send(defaultFilms);
  }

  const duration = Number(req.query["minimum-duration"]);
  if(isNaN(duration) || duration <= 0){
    return res.sendStatus(400);
  }

  const filteredFilms = defaultFilms.filter(film => film.duration >= duration);

  return res.send(filteredFilms);
});

// Read film by id
router.get("/:id",(req, res) => {
  const id = Number(req.params.id);

  if(isNaN(id)){
    res.sendStatus(400)
  }

  
  const film = defaultFilms.find(film => film.id === id);

  if(film===undefined){
  res.sendStatus(404)
  }
  res.send(film);
});


router.post("/", (req, res) =>{
  const body : unknown = req.body;
  if(
    !body ||
    typeof body !== "object" ||
    !("id" in body) ||
    !("title" in body) ||
    !("director" in body) ||
    !("duration" in body) ||
    typeof body.id !== "number" ||
    typeof body.title !== "string" ||
    typeof body.director !== "string" ||  
    typeof body.duration !== "number" ||
    !body.title.trim() ||
    !body.director.trim() ||
    (("budget" in body) && (typeof body.budget !== "number" || body.budget <= 0)) ||
    (("description" in body) && (typeof body.description !== "string" || !body.description.trim())) ||
    (("duration" in body) && (typeof body.duration !== "number" || body.duration <= 0))
  ){
    res.sendStatus(400);
  }

  const newFilm = body as NewFilm;

  const nextId = defaultFilms.reduce((acc, film) => (film.id > acc ? film.id : acc), 0) + 1;

  const addedFilm: Film = {id: nextId, ...newFilm};

  const existingFilm = defaultFilms.find(
    (film) => 
      film.title.toLocaleLowerCase === newFilm.title.toLocaleLowerCase && 
      film.director.toLocaleLowerCase === newFilm.director.toLocaleLowerCase);
  
  
  if(existingFilm){
    res.sendStatus(409);
  }

  defaultFilms.push(addedFilm);

  return res.json(addedFilm); 
});




router.delete("/:id", (req, res) =>{

  const id = Number(req.params.id);

  if(isNaN(id)){
      res.sendStatus(400)
  }

  const index = defaultFilms.findIndex((film) => (film.id === id));

  if(index===-1){
    res.sendStatus(404);
  }

  const deletedElements = defaultFilms.splice(index,1);
  res.json(deletedElements[0]);
});


router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);

  if(isNaN(id)){
    return res.sendStatus(400);
  }

  const filmToUpdate = defaultFilms.find(film => film.id === id);

  if(filmToUpdate===undefined){
    return res.sendStatus(404);
  }

  const body: unknown = (req.body);

 if (
    !body ||
    typeof body !== "object" ||
    Object.keys(body).length === 0 ||
    ("title" in body &&
      (typeof body.title !== "string" || !body.title.trim())) ||
    ("director" in body &&
      (typeof body.director !== "string" || !body.director.trim())) ||
    ("duration" in body &&
      (typeof body.duration !== "number" || body.duration <= 0)) ||
    ("budget" in body &&
      (typeof body.budget !== "number" || body.budget <= 0)) ||
    ("description" in body &&
      (typeof body.description !== "string" || !body.description.trim())) ||
    ("imageUrl" in body &&
      (typeof body.imageUrl !== "string" || !body.imageUrl.trim()))
  ) {
    return res.sendStatus(400);
  }

    const updatedFilm = {...filmToUpdate,...body};

    defaultFilms[defaultFilms.indexOf(filmToUpdate)] = updatedFilm;

    return res.send(updatedFilm);
});


router.put("/:id", (req, res) =>{
  const body: unknown = req.body;

  if (
    !body ||
    typeof body !== "object" ||
    !("title" in body) ||
    !("director" in body) ||
    !("duration" in body) ||
    typeof body.title !== "string" ||
    typeof body.director !== "string" ||
    typeof body.duration !== "number" ||
    !body.title.trim() ||
    !body.director.trim() ||
    body.duration <= 0 ||
    ("budget" in body &&
      (typeof body.budget !== "number" || body.budget <= 0)) ||
    ("description" in body &&
      (typeof body.description !== "string" || !body.description.trim())) ||
    ("imageUrl" in body &&
      (typeof body.imageUrl !== "string" || !body.imageUrl.trim()))
  ) {
    return res.sendStatus(400);
  }

  const id = Number(req.params.id);

  if(isNaN(id)){
    res.sendStatus(400);
  }

  const indexOfFilmToUpdate = defaultFilms.findIndex(film => film.id === id);

  if(indexOfFilmToUpdate===-1){
    const newFilm = body as NewFilm;
    const nextId = defaultFilms.reduce((acc, film) => (film.id > acc ? film.id: acc), 0) + 1;
    const addedFilm = {id : nextId, ...newFilm};
    defaultFilms.push(addedFilm);
    return res.json(addedFilm);
  }

  const filmToUpdate = {...defaultFilms[indexOfFilmToUpdate], ...body} as Film;

  defaultFilms[indexOfFilmToUpdate] = filmToUpdate;

  return res.send(filmToUpdate);



});


export default router;
