# reto-testing-demoqa
Reto 5 de Automatización CLOUD

Objetivos de Aprendizaje
Al completar este reto, serás capaz de:

Configurar un entorno de testing automatizado desde cero
Escribir tests automatizados con Playwright
Integrar inteligencia artificial (IA) en el proceso de testing
Usar Model Context Protocol (MCP) para conectar herramientas
Implementar auto-reparación de tests con IA generativa
Prerequisitos
Software que Debes Instalar

Node.js (v18.0.0 o superior)
Descarga desde: https://nodejs.org/
Verifica con: node --version
Visual Studio Code
Descarga desde: https://code.visualstudio.com/
Ollama (IA local gratuita)
macOS/Linux: https://ollama.ai/download
Windows: https://ollama.ai/download/windows
Git (para control de versiones)
Descarga desde: https://git-scm.com/
Extensiones de VS Code Requeridas

GitHub Copilot (requiere cuenta GitHub)
GitHub Copilot Chat
Playwright Test for VSCode


Criterios de Evaluación:

[ ] Reportes HTML se generan correctamente
[ ] Screenshots de fallos se guardan
[ ] Videos de fallos se graban
[ ] Script de ejecución funciona
[ ] Reportes son claros y navegables
Entrega del Reto
Formato de Entrega

Carpeta comprimida (alternativa):
Nombre: reto-testing-[tu-apellido].zip
Incluir todo el proyecto excepto node_modules/
Incluir carpeta de screenshots y reportes
[package.json tiene todas las dependencias
Recursos de Ayuda
Documentación Oficial

Playwright: https://playwright.dev/docs/intro
DemoQA: https://demoqa.com/
Ollama: https://ollama.ai/
MCP: https://modelcontextprotocol.io/
Tutoriales Recomendados

Playwright Tutorial for Beginners (YouTube)
Ollama Quick Start Guide
VS Code Copilot Documentation
Comunidad

Discord de Playwright
Stack Overflow (tag: playwright)
GitHub Discussions de Ollama
Tareas:
Parte 1: Configuración del Entorno
Tarea 1.1: Crear Proyecto Base (10 puntos)
Crea un nuevo proyecto de testing con la siguiente estructura:

reto-testing-demoqa/

├── tests/

├── helpers/

├── screenshots/

├── reportes/

├── package.json

├── playwright.config.js

└── README.md

Requisitos:

Inicializar proyecto Node.js
Instalar Playwright como dependencia de desarrollo
Instalar navegadores de Playwright
Crear archivo .gitignore apropiado
Entregables:

[ ] Carpeta de proyecto creada
[ ] package.json con dependencias correctas
[ ] Comando npx playwright test --version funciona



Tarea 1.2: Configurar Ollama (10 puntos)
Requisitos:

Iniciar servidor Ollama
Descargar modelo llama3.2
Verificar que el modelo responde correctamente
Entregables:

[ ] Ollama corriendo en http://localhost:11434
[ ] Modelo llama3.2 descargado
[ ] Screenshot de una respuesta exitosa de Ollama
 


Tarea 1.3: Configurar VS Code con MCP (10 puntos)
Requisitos:

Configurar archivo de settings de VS Code para habilitar MCP
Agregar servidor MCP de Playwright
Activar GitHub Copilot en modo Agent
Entregables:

[ ] Archivo .vscode/settings.json con configuración MCP
[ ] GitHub Copilot funcionando en modo Agent
[ ] Screenshot mostrando herramientas MCP disponibles



Tarea 1.4: Configurar Playwright (10 puntos)
Crea un archivo playwright.config.js con:

URL base: https://demoqa.com
Timeout de 30 segundos
Screenshots en caso de fallo
Reporter HTML
2 reintentos en caso de fallo
Entregables:

[ ] playwright.config.js correctamente configurado
[ ] Test de ejemplo ejecuta sin errores
 


Parte 2: Tests Automatizados Básicos
Tarea 2.1: Test de Elementos - Text Box (10 puntos)
Objetivo: Crear un test que valide el formulario Text Box de DemoQA.

URL: https://demoqa.com/text-box

El test debe:

Navegar a la página Text Box
Rellenar los 4 campos del formulario:
Full Name: "Tu Nombre Completo"
Email: "tuemail@ejemplo.com"
Current Address: "Tu Dirección Actual"
Permanent Address: "Tu Dirección Permanente"
Hacer click en el botón "Submit"
Verificar que aparece el panel de resultados con los datos correctos
Tomar un screenshot del resultado
Archivo: tests/01-text-box.spec.js

Criterios de Evaluación:

[ ] Test navega correctamente
[ ] Todos los campos se rellenan
[ ] Verificación del resultado funciona
[ ] Screenshot se genera correctamente
[ ] Test pasa exitosamente



Tarea 2.2: Test de Formulario - Practice Form (5 puntos)
Objetivo: Automatizar el llenado del formulario de práctica completo.

URL: https://demoqa.com/automation-practice-form

El test debe rellenar:

First Name y Last Name
Email
Género (cualquiera)
Mobile Number (10 dígitos)
Date of Birth (usar el date picker)
Subjects (al menos 1)
Hobbies (al menos 1)
Current Address
Acciones adicionales:

Click en Submit
Verificar que aparece el modal de confirmación
Tomar screenshot del modal
Cerrar el modal
Archivo: tests/02-practice-form.spec.js

Criterios de Evaluación:

[ ] Todos los campos se rellenan correctamente
[ ] Date picker funciona
[ ] Modal de confirmación aparece
[ ] Datos en modal coinciden con los ingresados
[ ] Test pasa exitosamente



Tarea 2.3: Test de Interacciones - Drag and Drop (10 puntos)
Objetivo: Validar la funcionalidad de drag and drop.

URL: https://demoqa.com/droppable

El test debe:

Navegar a la página Droppable
Verificar texto inicial del área drop: "Drop here"
Arrastrar el elemento "Drag me" al área de drop
Verificar que el texto cambió a "Dropped!"
Verificar que el color de fondo cambió (clase CSS)
Tomar screenshot del resultado
Archivo: tests/03-drag-drop.spec.js

 


Parte 3: Integración con IA Generativa
Tarea 3.1: Helper de IA con Ollama (10 puntos)
Objetivo: Crear un módulo helper que use Ollama para analizar errores de tests.

Archivo: helpers/ai-helper.js

El helper debe tener 2 funciones:

analizarError(testCode, errorMessage)
Recibe: código del test y mensaje de error
Usa Ollama (llama3.2) para analizar el error
Retorna: explicación del error y sugerencia de solución
sugerirSelectorAlternativo(selectorOriginal)
Recibe: selector que no funciona
Usa Ollama para sugerir alternativas
Retorna: lista de 3 selectores alternativos ordenados por robustez
Criterios de Evaluación:

[ ] Función analizarError funciona correctamente
[ ] Función sugerirSelectorAlternativo retorna sugerencias válidas
[ ] Integración con Ollama funciona
[ ] Código está documentado con comentarios
[ ] Manejo de errores implementado

Tarea 3.2: Script de Auto-Reparación (10 puntos)
Objetivo: Crear un script que detecte tests fallidos y genere sugerencias de reparación.

Archivo: auto-repair.js

El script debe:

Ejecutar todos los tests
Detectar cuáles fallaron
Para cada test fallido:
Extraer código del test
Extraer mensaje de error
Llamar al helper de IA para análisis
Generar reporte con sugerencias
Guardar reporte en reportes/auto-repair-[fecha].md
El reporte debe incluir:

Nombre del test fallido
Error original
Análisis de la IA
Sugerencias de reparación
Código sugerido (si aplica)
Criterios de Evaluación:

[ ] Script ejecuta tests automáticamente
[ ] Detecta tests fallidos correctamente
[ ] Integra con helper de IA
[ ] Genera reporte en formato Markdown
[ ] Reporte es claro y útil
 


Parte 4: Suite Completa y Reportes
Tarea 4.1: Tests Adicionales (5 puntos)
Crea tests adicionales para las siguientes funcionalidades de DemoQA:

Test 4: Alerts

URL: https://demoqa.com/alerts
Probar los 3 tipos de alertas (simple, con delay, prompt)
Test 5: Book Store - Búsqueda

URL: https://demoqa.com/books
Buscar un libro usando el search box
Verificar resultados filtrados
Archivo: tests/04-alerts.spec.js y tests/05-bookstore.spec.js


Tarea 4.2: Configuración de Reportes ( 5 puntos)
Requisitos:

Configurar Playwright para generar reportes HTML detallados
Agregar screenshots automáticos en caso de fallo
Agregar videos de ejecución en caso de fallo
Crear script run-tests.sh que:
Limpia reportes anteriores
Ejecuta todos los tests
Genera reporte
Abre reporte automáticamente
