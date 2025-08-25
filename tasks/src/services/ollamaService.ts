export async function ollamaChat(prompt: string, parseJson = false, model: string = "NicoleShelterV1") {
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!response.ok) throw new Error("Ollama API error");

  // Streaming response handling
  let fullContent = "";
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");
  const decoder = new TextDecoder();
  let done = false;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      const chunk = decoder.decode(value);
      // Each chunk is a JSON object, one per line
      // Accumulate only the message content
      try {
        const lines = chunk.split(/\r?\n/).filter(Boolean);
        for (const line of lines) {
          const obj = JSON.parse(line);
          if (obj.message && obj.message.content) {
            fullContent += obj.message.content;
          }
        }
      } catch (e) {
        // Ignore non-JSON lines (sometimes streaming includes keepalive or blank lines)
      }
    }
  }

  if (parseJson) {
    try {
      // Обрезаем всё до первой и после последней фигурной скобки
      const match = fullContent.match(/{[\s\S]*}/);
      if (match) {
        // Удаляем неэкранированные управляющие символы (кроме стандартных \t, \n, \r внутри строк)
        let cleaned = match[0].replace(/([\x00-\x1F\x7F])/g, (c) => {
          // Оставляем только табуляцию, перевод строки и возврат каретки
          return (c === '\\n' || c === '\\r' || c === '\\t') ? c : ' ';
        });
        // Также пробуем удалить невалидные символы вне строк
        cleaned = cleaned.replace(/\u0000|\u0001|\u0002|\u0003|\u0004|\u0005|\u0006|\u0007|\u0008|\u000B|\u000C|\u000E|\u000F|\u0010|\u0011|\u0012|\u0013|\u0014|\u0015|\u0016|\u0017|\u0018|\u0019|\u001A|\u001B|\u001C|\u001D|\u001E|\u001F|\u007F/g, ' ');
        return JSON.parse(cleaned);
      } else {
        // Если JSON не найден, возвращаем как материал или задание весь текст
        return { material: fullContent, task: fullContent };
      }
    } catch (e) {
      throw new Error("Ошибка парсинга JSON от Ollama: " + (e instanceof Error ? e.message : String(e)));
    }
  }
  return fullContent;
}
