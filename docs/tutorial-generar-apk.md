# Tutorial: generar e instalar el APK de AquaBloom

Este tutorial explica cómo convertir el código de AquaBloom Mobile en una
aplicación instalable para Android mediante EAS Build, el servicio de compilación
de Expo. Está escrito para repetir el proceso sin necesitar Android Studio.

## Conceptos básicos

- **APK:** archivo instalable directamente en un teléfono Android.
- **EAS Build:** servicio de Expo que recibe una copia del proyecto, compila el
  código nativo, firma la aplicación y entrega el APK.
- **Perfil `preview`:** configuración usada para obtener un APK de prueba.
- **Keystore:** clave con la que se firma la aplicación. Android la usa para
  reconocer que las versiones futuras pertenecen a la misma aplicación.
- **Build:** una versión compilada de la aplicación. Generar un APK no publica la
  aplicación en Google Play.

El APK `preview` de AquaBloom incluye el código JavaScript y los componentes
nativos. Después de instalarlo no necesita Expo Go, Metro ni mantener el
computador encendido.

## 1. Requisitos

Antes de comenzar se necesita:

1. El repositorio `Aquabloom-mobile` descargado.
2. Node.js 24 y pnpm 11.
3. Una cuenta de Expo.
4. Acceso al proyecto `@deimon005/aquabloom-mobile` en Expo.
5. EAS CLI instalado.

Para instalar EAS CLI con pnpm:

```sh
pnpm add --global eas-cli
```

También puede ejecutarse sin instalación global usando `npx eas-cli@latest` en
lugar de `eas` en cada comando.

## 2. Abrir el proyecto correcto

En GitHub Desktop:

1. Seleccionar el repositorio `Aquabloom-mobile`.
2. Seleccionar la rama que se desea compilar.
3. Comprobar que no haya cambios pendientes que deban incluirse.
4. Abrir una terminal en la carpeta del repositorio.

Instalar las dependencias:

```sh
pnpm install --frozen-lockfile
```

## 3. Iniciar sesión en Expo

```sh
eas login
eas whoami
```

`eas whoami` debe mostrar la cuenta que tiene acceso al proyecto. AquaBloom está
vinculado actualmente a `deimon005`.

No es necesario ejecutar `eas init` nuevamente en este repositorio. La
vinculación ya está guardada en `app.json` mediante el propietario y el
`projectId` real.

## 4. Comprobar la configuración Android

El archivo `app.json` contiene:

- el identificador Android `com.aquabloom.mobile`;
- el propietario de Expo;
- el identificador del proyecto EAS;
- los plugins nativos, incluido MapLibre.

El archivo `eas.json` define el perfil `preview` de esta forma:

```json
{
  "preview": {
    "environment": "preview",
    "distribution": "internal",
    "android": { "buildType": "apk" }
  }
}
```

`buildType: apk` solicita un archivo instalable. Una compilación Android normal
puede producir un AAB, que sirve para Google Play pero no se instala directamente.

## 5. Configurar servicios externos cuando existan

AquaBloom espera estas variables públicas:

```text
EXPO_PUBLIC_API_URL
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Se deben guardar en el entorno `preview` del proyecto de Expo antes de compilar
una versión conectada a servicios reales. Se pueden administrar en el panel de
Expo o con comandos como:

```sh
eas env:set --environment preview --visibility plaintext --name EXPO_PUBLIC_API_URL --value https://api.ejemplo.cl/api/v1
```

Se repite el comando para la URL y la clave pública de Supabase. Los valores que
empiezan por `EXPO_PUBLIC_` quedan incorporados en la aplicación y no deben
contener contraseñas, `service_role`, claves privadas ni secretos del servidor.

Si los servicios todavía no existen, el APK puede generarse igualmente, pero el
login y los datos remotos no estarán disponibles.

## 6. Revisar el proyecto antes de compilar

Ejecutar:

```sh
pnpm run check
pnpm run export:android
```

El primer comando revisa formato, ESLint, TypeScript y pruebas. El segundo
comprueba que Expo puede crear el paquete JavaScript para Android, pero por sí
solo no genera un APK.

## 7. Generar el APK

Desde la carpeta del repositorio:

```sh
eas build --platform android --profile preview
```

En el primer build, EAS puede preguntar si debe generar un Android Keystore. Si
el proyecto aún no tiene uno, se elige **Generate new keystore**. Expo guarda la
clave para firmar las siguientes versiones.

EAS realiza estos pasos:

1. Comprime una copia del proyecto.
2. La sube a sus servidores.
3. Instala las dependencias.
4. Genera y compila el proyecto nativo Android.
5. Firma la aplicación.
6. Publica el APK y muestra un enlace al build.

Cerrar la terminal o apagar el computador después de iniciar la compilación no
detiene el trabajo que ya se está realizando en los servidores de Expo. El estado
puede consultarse en el panel del proyecto.

## 8. Descargar e instalar en Android

Cuando el build indique `Finished`:

1. Abrir la página del build.
2. Copiar el enlace de instalación o del APK.
3. Abrirlo desde el teléfono Android.
4. Descargar el archivo.
5. Autorizar temporalmente la instalación desde el navegador o Archivos si
   Android lo solicita.
6. Pulsar **Instalar** y luego **Abrir**.

El build comprobado para el Sprint 1 fue:

- ID: `74b7edf7-dbb1-473e-90af-b6867b152372`.
- Perfil: `preview`.
- Paquete: `com.aquabloom.mobile`.
- Resultado: APK generado, instalado y abierto correctamente en Android.

## 9. Crear una versión nueva

Cada vez que se cambie el código o una variable `EXPO_PUBLIC_` usada durante la
compilación, se debe generar un APK nuevo con el mismo comando:

```sh
eas build --platform android --profile preview
```

El teléfono no recibe automáticamente una compilación nueva. Se descarga el APK
nuevo y se instala sobre la versión anterior. Debe conservarse el mismo paquete y
la misma firma para que Android lo reconozca como una actualización.

## Qué significa “hacer que funcione la API desplegada”

La aplicación móvil y la API son programas distintos. El APK se ejecuta en el
teléfono. La API FastAPI debe ejecutarse permanentemente en un servidor accesible
por Internet.

Hacer que funcione la API desplegada significa:

1. Publicar FastAPI en un servicio de alojamiento.
2. Configurar allí la base de datos, Supabase, CORS y las variables privadas.
3. Obtener una URL HTTPS estable, por ejemplo
   `https://api.aquabloom.cl/api/v1`.
4. Comprobar que rutas como `/health`, `/lakes` y `/stations` respondan.
5. Configurar esa URL como `EXPO_PUBLIC_API_URL` en Expo.
6. Generar otro APK para que la dirección quede incorporada en la aplicación.

No significa ejecutar FastAPI solamente en el computador de un integrante. Una
dirección como `localhost` apunta al propio teléfono y deja de funcionar cuando
el computador se apaga. Una API realmente desplegada continúa disponible en un
servidor externo.

## Referencias oficiales

- [Crear el primer build con EAS](https://docs.expo.dev/build/setup/)
- [Generar APK para Android](https://docs.expo.dev/build-reference/apk/)
- [Variables de entorno en EAS](https://docs.expo.dev/eas/environment-variables/)
