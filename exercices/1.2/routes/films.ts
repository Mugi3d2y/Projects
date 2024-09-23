import { Router } from "express";

import { Film } from "../types";

const router = Router();


const defaultFilms: Film[] = [
  {
    id: 1,
    title: "L'Énigme du Saphir Bleu",
    director: "Marie Dupont",
    duration: 135,
  },
  {
    id: 2,
    title: "Les Ombres de la Nuit",
    director: "Antoine Martin",
    duration: 110,
  },
  {
    id: 3,
    title: "Le Secret des Anciens",
    director: "Jean-Luc Moreau",
    duration: 125,
  }
];

/* Read all the pizzas from the menu
   GET /pizzas?order=title : ascending order by title
   GET /pizzas?order=-title : descending order by title
*/
router.get("/", (_req, res) => {
  return res.json(defaultFilms);
});



export default router;
