export function pipeToResponse(stream, response) {
  const stopReading = () => {
    stream.destroy();
  };

  response.on("close", stopReading);
  response.on("error", stopReading);
  stream.on("error", () => {
    response.destroy();
  });
  stream.pipe(response);
}
