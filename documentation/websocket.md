# Websockets (Socket.io)
En este apartado se detallara por este medio las funciones con las que se administra ristokit.

[**Ejemplos Postman**](https://ristokitdocumentation.postman.co/workspace/RistoKitDocumentation~df154953-cf1f-43f5-8fc9-639daa8e5f6e/overview)

# Indice

- [Introduccion](#introduccion)
    - [Instalacion](#instalacion)
    - [Script ejemplo basico](#script-ejemplo-basicos)
- [Estructura](#estructura)
- [Peticiones](#peticiones)
- [Ejemplos](#ejemplos)
    - [Ejemplo  peticion [FINDSTATUS]](#1--ejemplo-peticion-findstatus)
    - [Ejemplo peticion [FINDONE]](#2--ejemplo-peticion-findone)
    - [Ejemplo de Notificación](#3--ejemplo-notificacion)
---

<br>

#### URL:

**Develop**:

```
    https://websocket-ristokit-develop.pidrive.com.ar
```

**Staging**:

```
    https://websocket-ristokit-staging.pidrive.com.ar
```

**Production**:

```
    https://websocket-ristokit-production.pidrive.com.ar
```

## Introduccion
### Instalacion
```shell
npm install socket.io-client

```
---

<br>

### Script ejemplo basicos

```javascript
import io from "socket.io-client";

const socket = io("https://websocket-ristokit-backend.pidrive.com.ar"); // URL del servidor

socket.on("connect", () => {
  console.log("Conectado al servidor Socket.IO");

  // Enviar un mensaje al servidor
  socket.emit("sendMessage", "Hola desde el cliente");

  // Escuchar respuestas del servidor
  // con eventname: "message"
  socket.on("message", (data) => {
    console.log("Mensaje del servidor:", data);
  });
});

// Detectar desconexión
socket.on("disconnect", () => {
  console.log("Desconectado del servidor");
});

```
> Es importante destacar que _"message"_ de _socket.emit_ representa un **eventname**
---
<br>



## Estructura
A partir de este punto, se asume que la conexion ya fue establecida y solo se tendra en cuenta lo que se enviara

```javascript
socket.emit( [ EVENTNAME ] , [ mensaje ] )
```


La estructura de los mensajes es la siguente:
```json
{
    "headers":{
        "authorization": "token-valido"
    },
    "body":{
        ...
    }
}
```
> - **header**: esta propiedad siempre debe estar presente en cada peticion, de lo contrario devolvera error.
>> - **authorization**: El **_authorization_** es el mismo que de la sesion. Si ese expira, la peticion devolvera un error.

> - **body**: En el **_body_** contendra la respuesta solicitada por cada _eventname_.
---

<br>

## Peticiones

<details>
    <summary>Orders</summary>
    <details>
        <summary>&nbsp;&nbsp;Ordenes por estado y tipo</summary>
        <h4>eventname: "findstatus"</h4>
        <pre>
            <code>
            {
                "headers": {
                    "token": "token-valido"
                },
                "body": {
                    "type": "delivery",
                    "status": "pending"
                }
            }
            </code>
        </pre>
        <hr></hr>
    </details>
    <details>
        <summary>&nbsp;&nbsp;Actualizar una orden</summary>
        <pre>
            <code>
            {
                "headers": {
                    "token": "token-valido"
                },
                "body": {
                    "id": 5,
                    "paymentMethod": "Cash",
                    "clientName": "ramon",
                    ...
                }
            }
            </code>
        </pre>
        <hr></hr>
    </details>
    <details>
        <summary>&nbsp;&nbsp;Encontrar orden por id</summary>
        <h4>eventname: "findone"</h4>
        <pre>
            <code>
            {
                "headers": {
                    "token": "token-valido"
                },
                "body": {
                    "id": 1
                }
            }
            </code>
        </pre>
        <hr></hr>
    </details>
   <hr></hr>
</details>



<details>
    <summary>Summary</summary>
    <details>
        <summary>&nbsp;&nbsp;Obtener ganancias</summary>
        <h4>eventname: "earning"</h4>
        <pre>
            <code>
            {
                "headers": {
                    "token": "token-valido"
                },
                "body": {
                }
            }
            </code>
        </pre>
        <hr></hr>
    </details>
    <details>
        <summary>&nbsp;&nbsp;Obtener total ordenes generadas</summary>
        <h4>eventname: "orders"</h4>
        <pre>
            <code>
            {
                "headers": {
                    "token": "token-valido"
                },
                "body": {
                }
            }
            </code>
        </pre>
        <hr></hr>
    </details>
    <details>
        <summary>&nbsp;&nbsp;Obtener total deliveries</summary>
        <h4>eventname: "delivered"</h4>
        <pre>
            <code>
            {
                "headers": {
                    "token": "token-valido"
                },
                "body": {
                    "type": "Total",
                }
            }
            </code>
        </pre>
        <hr></hr>
    </details>
    <details>
        <summary>&nbsp;&nbsp;Obtener total de delivery, entrantes y otros</summary>
        <h4>eventname: "delivered"</h4>
        <pre>
            <code>
            {
                "headers": {
                    "token": "token-valido"
                },
                "body": {
                    "type": "GraphicSummary",
                }
            }
            </code>
        </pre>
        <hr></hr>
    </details>
    <details>
        <summary>&nbsp;&nbsp;Obtener total vendido</summary>
        <h4>eventname: "sold"</h4>
        <pre>
            <code>
            {
                "headers": {
                    "token": "token-valido"
                },
                "body": {
                }
            }
            </code>
        </pre>
        <hr></hr>
    </details>
    <details>
        <summary>&nbsp;&nbsp;Obtener total vendido DESDE-HASTA</summary>
        <h4>eventname: "soldmargin"</h4>
        <pre>
            <code>
            {
                "headers": {
                    "token": "token-valido"
                },
                "body": {
                    "from": "aa/bb/cc ..."
                    "to": "aa/bb/cc ..."
                }
            }
            </code>
        </pre>
        <hr></hr>
    </details>
    <details>
        <summary>&nbsp;&nbsp;Obtener top 4 vendidos</summary>
        <h4>eventname: "top-seller"</h4>
        <pre>
            <code>
            {
                "headers": {
                    "token": "token-valido"
                },
                "body": {
                }
            }
            </code>
        </pre>
        <hr></hr>
    </details>
    <hr></hr>
</details>

---

<br>

## Ejemplos

### 1- Ejemplo peticion [FINDSTATUS]
Se realizara la peticion a

 - eventname: "**_findstatus_**"
 - body: 
 

>```json
>    {
>        "type": "delivery",
>        "status": "all"
>    }
> ```


#### Script:

```javascript
import io from "socket.io-client";

const socket = io("https://websocket-ristokit-backend-develop.pidrive.com.ar"); // URL del servidor

socket.on("connect", () => {
  console.log("Conectado al servidor Socket.IO");
    const msg = {
        headers:{
            token: "token-valid"
        },
        body:{
            type: "delivery",
            status: "all"
        }
    }
    
  // Enviar un mensaje al servidor
  // eventname: 'findstatus'
  socket.emit("findstatus", JSON.stringify(msg));

});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor");
});
```

#### [Ejemplo en POSTMAN](https://ristokitdocumentation.postman.co/workspace/RistoKitDocumentation~df154953-cf1f-43f5-8fc9-639daa8e5f6e/ws-socketio-request/6793a3ac0979325625a42ecd?action=share&creator=41307841&ctx=documentation)
---

<br>

### 2- Ejemplo peticion [FINDONE]
Se realizara la peticion a

 - eventname: "**_findstatus_**"
 - body: 
 

>```json
>    {
>        "type": "delivery",
>        "status": "all"
>    }
> ```


#### Script:

```javascript
import io from "socket.io-client";

const socket = io("https://websocket-ristokit-backend-develop.pidrive.com.ar"); // URL del servidor

socket.on("connect", () => {
  console.log("Conectado al servidor Socket.IO");
    const msg = {
        headers:{
            token: "token-valid"
        },
        body:{
            type: "delivery",
            status: "all"
        }
    }
    
  // Enviar un mensaje al servidor
  // eventname: 'findstatus'
  socket.emit("findone", JSON.stringify(msg));

});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor");
});
```

#### [Ejemplo en POSTMAN](https://ristokitdocumentation.postman.co/workspace/RistoKitDocumentation~df154953-cf1f-43f5-8fc9-639daa8e5f6e/ws-socketio-request/67939ea969c951396fdfb0d2?action=share&creator=41307841&ctx=documentation)

---

<br>

### 3- Ejemplo notificacion

Por el momento solo hay una notificacion habilitada, con el evento "_notification_".

Un ejemplo de informe de parte del servidor es el siguiente

- Nombre del evento: **_notification_**
```json
{
  "context": "New order created",
  "data": {
    "branch": {
      "id": 9,
      "branch_name": "MacDonals",
      "business": {
        "id": 1,
        "business_name": "test"
      }
    },
    "clientName": "ramon",
    "delivery": true,
    "direction": "coca",
    "id": 5,
    "isActive": true,
    "location": "las varillas",
    "paymentMethod": "cash",
    "phoneNumber": 3533440757,
    "postal_code": 5000,
    "status": "enabled",
    "table": {
      "branch": {
        "id": 9,
        "branch_name": "MacDonals",
        "business": {
          "id": 1,
          "business_name": "test"
        }
      },
      "enabled": true,
      "id": 5,
      "nro_mesa": 5
    },
    "total": 5000
  }
}
```

Ejemplo de configuracion del postman para escuchar los eventos:

[**Ejemplo en Postman**](https://ristokitdocumentation.postman.co/workspace/RistoKitDocumentation~df154953-cf1f-43f5-8fc9-639daa8e5f6e/ws-socketio-request/67948c9869c951396fe0e3ec?action=share&creator=41307841&ctx=documentation)

---
