# paella-ai-plugins

Paquete `@asicupv/paella-plugins` que proporciona plugins de inteligencia artificial para Paella Player.

## Plugins incluidos

| Plugin | ID | Descripción |
|--------|-----|-------------|
| AIContentPlugin | `es.upv.paella.ai.content` | Muestra contenido generado por IA (resumen, FAQ, plan de estudio, línea de tiempo, pódcast) |
| AIChatPlugin | `es.upv.paella.ai.chat` | Chat interactivo con modelos de lenguaje |
| AIToolsDataTestPlugin | `es.upv.paella.ai.content.data-test` | Proveedor de datos de prueba para AIContentPlugin |
| RealTimeCaptionsPlugin | `es.upv.paella.ai.realTimeCaptions` | Subtítulos en tiempo real generados por IA |

---

## AIContentPlugin

**ID:** `es.upv.paella.ai.content`

Muestra un panel con pestañas que contiene contenido generado por IA asociado al vídeo. Cada pestaña se muestra solo si hay datos disponibles para ella.

### Pestañas disponibles

- **Summary** — Resumen del contenido del vídeo.
- **FAQ** — Preguntas frecuentes sobre el contenido.
- **Study plan** — Plan de estudio sugerido.
- **Timeline** — Línea de tiempo del vídeo.
- **Podcast** — Audio generado tipo pódcast con análisis del contenido.

### Tecnologías

- **Preact** — UI renderizada como componente Preact.
- **Paella Data API** — Los datos se leen mediante `player.data.read("ai.content", <scope>)`.

### Configuración

```json
{
  "es.upv.paella.ai.content": {
    "enabled": true,
    "mode": "dialog"
  }
}
```

- `mode`: `"dialog"` (por defecto) o `"popup"` — modo de visualización del panel.

### Estructura de datos

Los datos se proporcionan mediante un plugin de datos (ver `AIToolsDataTestPlugin`) con el tipo:

```typescript
type AIContentData = {
  content: string | null;
  mediaUrl?: string | null;
};
```

---

## AIChatPlugin

**ID:** `es.upv.paella.ai.chat`

Proporciona un chat interactivo que permite al usuario hacer preguntas sobre el contenido del vídeo. Utiliza los subtítulos (captions) como contexto RAG para las respuestas del modelo.

### Tecnologías

- **WebLLM** (`@mlc-ai/web-llm`) — Ejecución de modelos de lenguaje directamente en el navegador vía WebGPU.
- **LangChain** (`@langchain/community`, `@langchain/openai`) — Capa de abstracción para modelos de lenguaje. Soporta dos backends:
  - `webllm`: modelo local ejecutado en el navegador (por defecto: `Qwen2.5-3B-Instruct-q4f16_1-MLC`).
  - `openai`: API compatible con OpenAI (requiere URL y API key).
- **Preact** — UI del chat.
- **Paella Captions API** — Se construye un RAG con los subtítulos del vídeo para dar contexto al modelo.

### Configuración

```json
{
  "es.upv.paella.ai.chat": {
    "enabled": true,
    "chat": {
      "enabled": true
    }
  }
}
```

### Ajustes del modelo (configurables por el usuario en la UI)

| Ajuste | Valor por defecto | Descripción |
|--------|--------------------|-------------|
| `modelType` | `"webllm"` | Backend: `"webllm"` o `"openai"` |
| `model` | `"Qwen2.5-3B-Instruct-q4f16_1-MLC"` | Nombre del modelo |
| `openAIURL` | `"https://api.openai.com/v1"` | URL base para API OpenAI |
| `openAIPasswd` | `""` | API key para OpenAI |
| `temperature` | `1.0` | Temperatura de generación |
| `maxTokens` | `4000` | Tokens máximos de respuesta |
| `systemPrompt` | *(prompt por defecto)* | Instrucción del sistema |

Los ajustes se guardan en `localStorage` por usuario.

---

## AIToolsDataTestPlugin

**ID:** `es.upv.paella.ai.content.data-test`

Plugin de datos que carga contenido de IA desde archivos estáticos alojados en el repositorio del vídeo. Sirve como proveedor de datos de ejemplo o desarrollo para `AIContentPlugin`.

### Tecnologías

- **Paella DataPlugin API** — Implementa la interfaz `DataPlugin` para el scope `"ai.content"`.
- **Fetch API** — Descarga los archivos de contenido desde el repositorio del vídeo.

### Configuración

```json
{
  "es.upv.paella.ai.content.data-test": {
    "enabled": true,
    "files": {
      "summary": {
        "file": "ai-summary.md"
      },
      "faq": {
        "file": "ai-faq.md"
      },
      "study_plan": {
        "file": "ai-study-plan.md"
      },
      "timeline": {
        "file": "ai-timeline.md"
      },
      "podcast": {
        "file": "ai-podcast.json",
        "media": "ai-podcast.mp3"
      }
    }
  }
}
```

- `files`: mapa de scopes a archivos. Cada entrada tiene:
  - `file`: ruta relativa al directorio del vídeo (`<repositoryUrl>/<videoId>/<file>`).
  - `media` *(opcional)*: ruta a un archivo multimedia asociado (ej. audio del pódcast).

---

## RealTimeCaptionsPlugin

**ID:** `es.upv.paella.ai.realTimeCaptions`

Genera subtítulos en tiempo real transcribiendo el audio del vídeo usando un modelo de reconocimiento de voz que se ejecuta localmente en el navegador.

### Tecnologías

- **Voxtral Mini 4B** (`onnx-community/Voxtral-Mini-4B-Realtime-2602-ONNX`) — Modelo de reconocimiento de voz multimodal de Mistral, ejecutado en formato ONNX.
- **Hugging Face Transformers.js** (`@huggingface/transformers`) — Runtime para inferencia de modelos ONNX en el navegador con soporte **WebGPU**.
- **Web Audio API** — Captura de audio del reproductor mediante `AudioWorkletNode` con:
  - Conversión a mono.
  - Filtro antialiasing (Butterworth de 8.º orden).
  - Remuestreo lineal a 16 kHz.
- **Preact** — UI de control (carga del modelo, iniciar/detener transcripción).
- **Paella Transcript API** — Los subtítulos generados se insertan en el panel de transcripción interactivo del reproductor (`es.upv.paella.transcriptInteractiveAreaPlugin`).

### Flujo de funcionamiento

1. El usuario abre el panel y pulsa "Load Model".
2. Se descarga el modelo ONNX (~archivos `q4f16`) y se inicializa en WebGPU.
3. Al iniciar la transcripción, se captura el audio del vídeo vía `AudioWorklet`.
4. El modelo procesa el audio en bloques de ~6 segundos y genera texto en streaming.
5. Los fragmentos de texto se insertan como entradas de transcripción sincronizadas con el tiempo del vídeo.

### Configuración

```json
{
  "es.upv.paella.ai.realTimeCaptions": {
    "enabled": true
  }
}
```

> **Nota:** Requiere que el plugin `es.upv.paella.transcriptInteractiveAreaPlugin` esté habilitado en la configuración del reproductor para mostrar los subtítulos generados.

---

## Ejemplo de configuración completa

```json
{
  "plugins": [
    {
      "es.upv.paella.ai.content": {
        "enabled": true,
        "mode": "dialog"
      }
    },
    {
      "es.upv.paella.ai.chat": {
        "enabled": true,
        "chat": {
          "enabled": true
        }
      }
    },
    {
      "es.upv.paella.ai.content.data-test": {
        "enabled": true,
        "files": {
          "summary": { "file": "ai-summary.md" },
          "faq": { "file": "ai-faq.md" },
          "study_plan": { "file": "ai-study-plan.md" },
          "timeline": { "file": "ai-timeline.md" },
          "podcast": { "file": "ai-podcast.json", "media": "ai-podcast.mp3" }
        }
      }
    },
    {
      "es.upv.paella.ai.realTimeCaptions": {
        "enabled": true
      }
    }
  ]
}
```

## Importación en código

```typescript
import {
  aiToolsPlugins,
  AIContentPlugin,
  AIChatPlugin,
  AIToolsDataTestPlugin,
  RealTimeCaptionsPlugin
} from "@asicupv/paella-ai-plugins";
import "@asicupv/paella-ai-plugins/paella-ai-plugins.css";
```
