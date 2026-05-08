import { Router } from "express";

import { estudios, estudio_detallado, lista_admisiones,buscarImagenes,paciente } from "../controllers/imagenes.controller.js";

const router = Router()

// Lista de rutas del servidor de Express 

router.post('/imagenes/descargar/:codigo',buscarImagenes)
router.get('/admisiones', lista_admisiones)
router.get('/imagenes/estado/:tipo',estudios)
router.get('/imagenes/resultado/:codigo', estudio_detallado)
router.get('/imagenes/descargar/:codigo',paciente)


export default router;