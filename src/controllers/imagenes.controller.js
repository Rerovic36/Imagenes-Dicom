import { poolmysql } from '../db.js';
import dayjs from 'dayjs';

// *********** Dependencias para descargar imagenes del servidor dicom Orthanc

import fs from 'fs'; 
import axios from 'axios'; // Se utiliza para buscar las instancias de Orthanc
import request from 'request'; // Se usa para descargar la imagenes


// Funcion para convertir texto enriquecido a texto plano

const convertirTextoPlano = (texto) => {
    texto = texto.replace(/\\par[d]?/g, "");
    texto = texto.replace(/\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g, "").trim();
    return parseSpecial(texto);
}


// Funciones para descargar imagenes del servidor dicom

const host_dicom = process.env.host_dicom
const puerto_dicom = process.env.puerto
const usuario_dicom = process.env.user
const contrasena_dicom = process.env.password_dicom
const ruta_imagen = process.env.ruta_guardado_imagenes

const descargarImagen = (data,index,cedula,fecha_actual) => {
    return new Promise ((resolve, reject) => {
      let dir = `${ruta_imagen}${cedula}/${fecha_actual}`;    //Directorio donde se guardaran las imagenes
      console.log(`Descargando imagen ${index}`)
      fs.mkdirSync(dir, { recursive: true });

      const options = {
            url: `http://${host_dicom}:${puerto_dicom}/instances/${data}/preview`,
            auth: {
              user: usuario_dicom,
              password: contrasena_dicom
            }
          }
      let req = request.get(options);
  
      req.on('response', res => {
        resolve(res);
        console.log("Imagen recibida del servidor!");
      }).pipe(fs.createWriteStream(`${ruta_imagen}${cedula}/${fecha_actual}/` + `${index}.jpg`));
      req.on('error', err => {
        reject(err);
      });
  
      req.end();
    }); 
  }

export const buscarImagenes = async (req,res) => {
  
    const cedula = req.params.codigo
    const fecha = req.body.fecha
    fecha = dayjs(fecha).format('YYYYMMDD'); // Se convierte en el formato necesario para poder consultar en los parametros del servidor orthanc

	  const response = await axios({
        method: 'post',
        url: `http://${host_dicom}:${puerto_dicom}/tools/find`,
        data: 
            {
                "Level" : "Instances",
                "Query" : { 
                  "PatientID" : `${cedula}`,
                  "StudyDate" : `${fecha}`  // "StudyDate" : "20260501-" Si quieres que sea mayor a esa fecha
                }
              },
            
            auth: {
                username: usuario_dicom,
                password: contrasena_dicom
              }
    
      })
      return response.data.map((data,index)=>{
        index = index + 1
        descargarImagen(data,index,cedula,fecha_actual);
    });
      
};


// Funciones que retornan la informacion consultada a la base de datos

// Admisiones activas
export const lista_admisiones = async (req, res) =>{
    const [results, fields] = await poolmysql.query("SELECT * FROM documentos WHERE estado = 1");    
    res.send(results)
}


// Estudios activos de imagenes
export const estudios = async (req, res) =>{
    const tipo = req.params.tipo
    const [results, fields] = await poolmysql.query("SELECT * FROM estudios_imagenes WHERE estado = 1 and tipo_estudio = ?",tipo);
    res.send(results)
}


// Informacion del estudio
export const estudio_detallado = async (req, res) =>{
    const codigo = req.params.codigo
    const [results, fields] = await poolmysql.query("SELECT * FROM estudios_imagenes WHERE id_paciente = ?", codigo);
    const cuerpo = convertirTextoPlano(results[0].cuerpo_estudio) // Aqui se transforma el texto enriquecido a texto plano
    res.send(results,cuerpo)
}


// Informacion del paciente

export const paciente = async (req, res) =>{
    const codigo = req.params.codigo
    const [results, fields] = await connection.query(`SELECT * FROM paciente WHERE id_paciente = ${codigo}`)    
    res.send(results)
}

export const login = async (req, res) =>{
    const id_usuario = req.body.id
    const clave_usuario = req.body.pass
    const nombre_usuario = req.body.user
}















